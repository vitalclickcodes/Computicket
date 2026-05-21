import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;
const VOUCHER_TTL_SECONDS = 60 * 60; // 1 hour

function publicApiUrl(): string {
  return process.env.PUBLIC_API_URL ?? 'http://localhost:4000/v1';
}

function signingKey(): string {
  return process.env.NFT_SIGNING_KEY ?? process.env.JWT_SECRET ?? 'dev_unsafe';
}

/**
 * Deterministic uint64-ish token id derived from the ticket's cuid.
 * SHA-256 → take first 8 bytes → mask to 63 bits so the value fits
 * comfortably in both Postgres BIGINT (signed) and a uint256 on-chain.
 */
function tokenIdFor(ticketId: string): bigint {
  const digest = createHash('sha256').update(ticketId).digest();
  const hi = BigInt(digest.readUInt32BE(0)) & 0x7fffffffn;
  const lo = BigInt(digest.readUInt32BE(4));
  return (hi << 32n) | lo;
}

@Injectable()
export class NftService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * OpenSea-compatible ERC-721 metadata. Public — the QR is the gate,
   * not the metadata. Lazy-assigns nftTokenId on first read so we don't
   * pre-allocate ids for tickets nobody collects.
   */
  async metadata(code: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: {
        ticketType: { select: { name: true } },
        order: {
          include: {
            event: {
              select: {
                title: true,
                description: true,
                venue: true,
                city: true,
                startsAt: true,
                organizer: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    await this.ensureTokenId(ticket.id, ticket.nftTokenId);

    const event = ticket.order.event;
    const tokenId = ticket.nftTokenId ?? tokenIdFor(ticket.id);
    const base = publicApiUrl();

    return {
      name: `${event.title} — ${ticket.ticketType.name}`,
      description:
        event.description ??
        `Verified attendance ticket for ${event.title} at ${event.venue}, ${event.city}.`,
      image: `${base}/tickets/${ticket.code}/qr.png`,
      external_url: `${base.replace(/\/v1$/, '')}/tickets/${ticket.code}/collectible`,
      attributes: [
        { trait_type: 'Event', value: event.title },
        { trait_type: 'Organizer', value: event.organizer.name },
        { trait_type: 'Venue', value: event.venue },
        { trait_type: 'City', value: event.city },
        { display_type: 'date', trait_type: 'Event Date', value: Math.floor(event.startsAt.getTime() / 1000) },
        { trait_type: 'Tier', value: ticket.ticketType.name },
        { trait_type: 'Status', value: ticket.status },
        { trait_type: 'Ticket Code', value: ticket.code },
      ],
      token_id: tokenId.toString(),
    };
  }

  /**
   * Bind a wallet address to the ticket and return a mint voucher. The
   * voucher's signature is HMAC-SHA256 for the MVP — a deployed ERC-721
   * lazy-mint contract would verify ECDSA over the same payload shape,
   * so swapping signers later doesn't change the API.
   */
  async claim(userId: string, code: string, walletRaw: string) {
    const wallet = walletRaw?.trim().toLowerCase() ?? '';
    if (!WALLET_RE.test(wallet)) {
      throw new BadRequestException('wallet must be a 0x-prefixed 40-char EVM address');
    }
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: {
        order: { select: { userId: true, status: true, event: { select: { title: true } } } },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status === 'VOIDED') {
      throw new ForbiddenException('Voided tickets cannot be collected');
    }
    if (ticket.order.status !== 'PAID') {
      throw new ForbiddenException('Order is not paid yet');
    }
    const ownerId = ticket.ownerUserId ?? ticket.order.userId;
    if (ownerId !== userId) {
      throw new ForbiddenException('Only the ticket holder can claim the collectible');
    }

    const tokenId = await this.ensureTokenId(ticket.id, ticket.nftTokenId);
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { nftClaimedWallet: wallet, nftClaimedAt: new Date() },
    });

    const base = publicApiUrl();
    const tokenURI = `${base}/tickets/${ticket.code}/metadata.json`;
    const expiresAt = Math.floor(Date.now() / 1000) + VOUCHER_TTL_SECONDS;
    const payload = `${wallet}|${tokenId.toString()}|${tokenURI}|${expiresAt}`;
    const signature = createHmac('sha256', signingKey()).update(payload).digest('hex');

    return {
      voucher: {
        recipient: wallet,
        tokenId: tokenId.toString(),
        tokenURI,
        expiresAt,
        scheme: 'HMAC-SHA256',
        signature,
      },
      ticket: {
        code: ticket.code,
        event: ticket.order.event.title,
        tokenId: tokenId.toString(),
        tokenURI,
        claimedWallet: wallet,
      },
      note:
        'MVP voucher: signed with the server key. A deployed lazy-mint ERC-721 ' +
        'contract will verify ECDSA over the same payload shape (recipient, tokenId, tokenURI, expiresAt).',
    };
  }

  /**
   * Look up the collectible state for a ticket the buyer owns (for the
   * /collectible page). No voucher is issued here — buyer must POST a
   * wallet to get one.
   */
  async status(userId: string, code: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: {
        ticketType: { select: { name: true } },
        order: {
          select: {
            userId: true,
            status: true,
            event: { select: { title: true, venue: true, city: true, startsAt: true } },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    const ownerId = ticket.ownerUserId ?? ticket.order.userId;
    if (ownerId !== userId) throw new ForbiddenException('Not your ticket');

    const tokenId = await this.ensureTokenId(ticket.id, ticket.nftTokenId);
    const base = publicApiUrl();
    return {
      code: ticket.code,
      status: ticket.status,
      orderStatus: ticket.order.status,
      event: ticket.order.event,
      ticketType: ticket.ticketType.name,
      tokenId: tokenId.toString(),
      tokenURI: `${base}/tickets/${ticket.code}/metadata.json`,
      imageUrl: `${base}/tickets/${ticket.code}/qr.png`,
      claimedWallet: ticket.nftClaimedWallet,
      claimedAt: ticket.nftClaimedAt,
    };
  }

  private async ensureTokenId(ticketId: string, existing: bigint | null): Promise<bigint> {
    if (existing != null) return existing;
    const tokenId = tokenIdFor(ticketId);
    try {
      await this.prisma.ticket.update({
        where: { id: ticketId },
        data: { nftTokenId: tokenId },
      });
    } catch {
      // Astronomical collision odds on a 63-bit hash space, but if two
      // tickets ever did collide we fall back to a random id derived from
      // the timestamp. The unique index ensures only one wins.
      const fallback = BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1000));
      await this.prisma.ticket.update({
        where: { id: ticketId },
        data: { nftTokenId: fallback },
      });
      return fallback;
    }
    return tokenId;
  }
}
