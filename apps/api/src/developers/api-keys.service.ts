import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const KEY_PREFIX = 'ctng_live_';
const PREFIX_DISPLAY_LEN = 16; // includes "ctng_live_"

function generateRawKey(): string {
  return `${KEY_PREFIX}${randomBytes(24).toString('base64url')}`;
}

export function hashApiKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizerSlug: string, name: string) {
    const organizer = await this.prisma.organizer.findUnique({ where: { slug: organizerSlug } });
    if (!organizer) throw new NotFoundException(`Organizer "${organizerSlug}" not found`);

    const raw = generateRawKey();
    const hashed = hashApiKey(raw);
    const prefix = raw.slice(0, PREFIX_DISPLAY_LEN);

    const created = await this.prisma.apiKey.create({
      data: { organizerId: organizer.id, name, prefix, hashedKey: hashed },
    });

    // Plaintext key only ever exists in this response.
    return {
      id: created.id,
      name: created.name,
      prefix: created.prefix,
      createdAt: created.createdAt,
      key: raw,
    };
  }

  async list(organizerSlug: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsedAt: true,
        revokedAt: true,
        createdAt: true,
      },
    });
    return keys;
  }

  async revoke(organizerSlug: string, id: string) {
    const updated = await this.prisma.apiKey.updateMany({
      where: { id, organizer: { slug: organizerSlug }, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (updated.count === 0) throw new NotFoundException('API key not found or already revoked');
    return { id, revoked: true };
  }

  async resolve(raw: string) {
    if (!raw.startsWith(KEY_PREFIX)) return null;
    const hashed = hashApiKey(raw);
    const key = await this.prisma.apiKey.findUnique({
      where: { hashedKey: hashed },
      include: {
        organizer: { select: { id: true, slug: true, name: true, status: true } },
      },
    });
    if (!key || key.revokedAt) return null;
    // Best-effort lastUsedAt bump; throttle to once a minute to avoid hammering DB.
    if (!key.lastUsedAt || Date.now() - key.lastUsedAt.getTime() > 60_000) {
      this.prisma.apiKey
        .update({ where: { id: key.id }, data: { lastUsedAt: new Date() } })
        .catch(() => undefined);
    }
    return { apiKeyId: key.id, organizer: key.organizer };
  }
}
