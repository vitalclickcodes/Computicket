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
const TOKEN_TTL_SECONDS = 3600;

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
    };
  }
}
