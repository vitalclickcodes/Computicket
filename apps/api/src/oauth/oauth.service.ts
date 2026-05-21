import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const CLIENT_ID_PREFIX = 'cli_';
const SECRET_PREFIX = 'cs_';
const TOKEN_PREFIX = 'oat_';
const CODE_PREFIX = 'oac_';
const TOKEN_TTL_SECONDS = 3600;
const CODE_TTL_SECONDS = 600; // 10 minutes

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

@Injectable()
export class OAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async listClients(organizerSlug: string) {
    return this.prisma.oAuthClient.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, clientId: true, name: true, scopes: true,
        redirectUris: true, active: true, createdAt: true,
      },
    });
  }

  async registerClient(organizerSlug: string, input: { name: string; scopes: string[]; redirectUris?: string[] }) {
    const organizer = await this.prisma.organizer.findUnique({ where: { slug: organizerSlug } });
    if (!organizer) throw new NotFoundException('Organizer not found');
    const clientId = `${CLIENT_ID_PREFIX}${randomBytes(12).toString('base64url')}`;
    const clientSecret = `${SECRET_PREFIX}${randomBytes(24).toString('base64url')}`;
    const created = await this.prisma.oAuthClient.create({
      data: {
        organizerId: organizer.id,
        clientId,
        clientSecretHash: sha256(clientSecret),
        name: input.name,
        scopes: input.scopes.join(' '),
        redirectUris: input.redirectUris ?? [],
      },
    });
    // Secret is shown once.
    return {
      id: created.id,
      clientId,
      clientSecret,
      name: created.name,
      scopes: input.scopes,
    };
  }

  async revokeClient(organizerSlug: string, id: string) {
    const updated = await this.prisma.oAuthClient.updateMany({
      where: { id, organizer: { slug: organizerSlug } },
      data: { active: false },
    });
    if (updated.count === 0) throw new NotFoundException('Client not found');
    return { id, active: false };
  }

  /**
   * Look up a client for the public consent screen. Validates redirectUri
   * against the client's registered list. Throws if anything is off.
   */
  async describeAuthorizationRequest(input: {
    clientId: string;
    redirectUri: string;
    scopes: string[];
  }) {
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId: input.clientId },
    });
    if (!client || !client.active) throw new UnauthorizedException('Invalid client');
    if (!client.redirectUris.includes(input.redirectUri)) {
      throw new BadRequestException('redirect_uri is not registered for this client');
    }
    const allowed = client.scopes.split(/\s+/).filter(Boolean);
    for (const s of input.scopes) {
      if (!allowed.includes(s)) {
        throw new BadRequestException(`Scope '${s}' not granted to this client`);
      }
    }
    return {
      client: { id: client.id, clientId: client.clientId, name: client.name },
      redirectUri: input.redirectUri,
      scopes: input.scopes,
    };
  }

  /**
   * User-authed grant. Issues a single-use code redeemable at /token.
   */
  async issueAuthorizationCode(input: {
    clientId: string;
    userId: string;
    redirectUri: string;
    scopes: string[];
  }) {
    const desc = await this.describeAuthorizationRequest({
      clientId: input.clientId,
      redirectUri: input.redirectUri,
      scopes: input.scopes,
    });
    const code = `${CODE_PREFIX}${randomBytes(20).toString('base64url')}`;
    await this.prisma.oAuthAuthorizationCode.create({
      data: {
        clientId: desc.client.id,
        userId: input.userId,
        codeHash: sha256(code),
        scopes: input.scopes.join(' '),
        redirectUri: input.redirectUri,
        expiresAt: new Date(Date.now() + CODE_TTL_SECONDS * 1000),
      },
    });
    return { code };
  }

  /**
   * Exchange an authorization code for an access token. Single-use; the
   * redirect_uri must match the one bound at authorize time.
   */
  async exchangeCode(input: {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }) {
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId: input.clientId },
    });
    if (!client || !client.active) throw new UnauthorizedException('Invalid client');
    if (!safeEqual(sha256(input.clientSecret), client.clientSecretHash)) {
      throw new UnauthorizedException('Invalid client');
    }
    const record = await this.prisma.oAuthAuthorizationCode.findUnique({
      where: { codeHash: sha256(input.code) },
    });
    if (!record || record.clientId !== client.id) {
      throw new UnauthorizedException('Invalid authorization code');
    }
    if (record.used) throw new UnauthorizedException('Authorization code already used');
    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Authorization code expired');
    }
    if (record.redirectUri !== input.redirectUri) {
      throw new BadRequestException('redirect_uri mismatch');
    }
    // Burn the code: conditional update so concurrent exchange attempts
    // can't both succeed.
    const burn = await this.prisma.oAuthAuthorizationCode.updateMany({
      where: { id: record.id, used: false },
      data: { used: true },
    });
    if (burn.count === 0) throw new UnauthorizedException('Authorization code already used');

    const scopes = record.scopes.split(/\s+/).filter(Boolean);
    const tokenPlain = `${TOKEN_PREFIX}${randomBytes(28).toString('base64url')}`;
    await this.prisma.oAuthAccessToken.create({
      data: {
        clientId: client.id,
        userId: record.userId,
        tokenHash: sha256(tokenPlain),
        scopes: scopes.join(' '),
        expiresAt: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000),
      },
    });
    return {
      access_token: tokenPlain,
      token_type: 'Bearer',
      expires_in: TOKEN_TTL_SECONDS,
      scope: scopes.join(' '),
    };
  }

  /**
   * OAuth 2.0 client_credentials grant.
   */
  async issueToken(input: { clientId: string; clientSecret: string; scope?: string }) {
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId: input.clientId },
    });
    if (!client || !client.active) throw new UnauthorizedException('Invalid client');
    if (!safeEqual(sha256(input.clientSecret), client.clientSecretHash)) {
      throw new UnauthorizedException('Invalid client');
    }
    const requested = (input.scope ?? client.scopes).split(/\s+/).filter(Boolean);
    const allowed = client.scopes.split(/\s+/).filter(Boolean);
    for (const s of requested) {
      if (!allowed.includes(s)) {
        throw new BadRequestException(`Scope '${s}' not granted to this client`);
      }
    }
    const tokenPlain = `${TOKEN_PREFIX}${randomBytes(28).toString('base64url')}`;
    const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);
    await this.prisma.oAuthAccessToken.create({
      data: {
        clientId: client.id,
        tokenHash: sha256(tokenPlain),
        scopes: requested.join(' '),
        expiresAt,
      },
    });
    return {
      access_token: tokenPlain,
      token_type: 'Bearer',
      expires_in: TOKEN_TTL_SECONDS,
      scope: requested.join(' '),
    };
  }

  /**
   * Verify a Bearer access token. Returns the client + scopes if valid.
   */
  async verifyToken(token: string) {
    if (!token.startsWith(TOKEN_PREFIX)) return null;
    const t = await this.prisma.oAuthAccessToken.findUnique({
      where: { tokenHash: sha256(token) },
      include: {
        client: {
          include: { organizer: { select: { id: true, slug: true, name: true } } },
        },
      },
    });
    if (!t || t.expiresAt.getTime() < Date.now()) return null;
    if (!t.client.active) return null;
    return {
      client: { id: t.client.id, name: t.client.name, clientId: t.client.clientId },
      organizer: t.client.organizer,
      scopes: t.scopes.split(/\s+/).filter(Boolean),
      userId: t.userId ?? null,
    };
  }
}
