import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PromoCodeType } from '@computicket/db';
import { PrismaService } from '../prisma/prisma.service';

interface CreateInput {
  organizerSlug: string;
  code: string;
  type: PromoCodeType;
  value: number;
  eventSlug?: string;
  maxUses?: number;
  expiresAt?: string;
}

@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(organizerSlug: string) {
    return this.prisma.promoCode.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { slug: true, title: true } } },
    });
  }

  async create(input: CreateInput) {
    if (input.type === 'PERCENTAGE' && (input.value < 1 || input.value > 10000)) {
      throw new BadRequestException('PERCENTAGE value must be 1-10000 basis points');
    }
    if (input.type === 'FIXED' && input.value < 1) {
      throw new BadRequestException('FIXED value must be > 0 kobo');
    }

    const organizer = await this.prisma.organizer.findUnique({
      where: { slug: input.organizerSlug },
    });
    if (!organizer) throw new NotFoundException('Organizer not found');

    let eventId: string | undefined;
    if (input.eventSlug) {
      const event = await this.prisma.event.findFirst({
        where: { slug: input.eventSlug, organizerId: organizer.id },
        select: { id: true },
      });
      if (!event) throw new NotFoundException('Event not found for this organizer');
      eventId = event.id;
    }

    try {
      return await this.prisma.promoCode.create({
        data: {
          organizerId: organizer.id,
          eventId,
          code: input.code.trim().toUpperCase(),
          type: input.type,
          value: input.value,
          maxUses: input.maxUses,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Code already in use for this organizer');
      }
      throw e;
    }
  }

  async deactivate(organizerSlug: string, id: string) {
    const updated = await this.prisma.promoCode.updateMany({
      where: { id, organizer: { slug: organizerSlug } },
      data: { active: false },
    });
    if (updated.count === 0) throw new NotFoundException('Promo code not found');
    return { id, active: false };
  }

  /**
   * Look up a promo code by its raw value (case-insensitive) for a given
   * event. Returns null if not found or not currently usable; never
   * throws.
   */
  async findUsable(eventId: string, code: string) {
    const normalised = code.trim().toUpperCase();
    const promo = await this.prisma.promoCode.findFirst({
      where: {
        code: normalised,
        active: true,
        event: { id: eventId },
        // OR a global code on the same organizer:
        OR: [
          { eventId: eventId },
          { eventId: null },
        ],
      },
      include: { organizer: { select: { id: true } }, event: { select: { id: true } } },
    });
    if (!promo) {
      // Try global codes — the OR above only applies if eventId-scoped found; do an explicit lookup
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true },
      });
      if (!event) return null;
      const global = await this.prisma.promoCode.findFirst({
        where: {
          code: normalised,
          active: true,
          organizerId: event.organizerId,
          eventId: null,
        },
      });
      if (!global) return null;
      return this.validate(global);
    }
    return this.validate(promo);
  }

  private validate(p: {
    id: string;
    type: PromoCodeType;
    value: number;
    maxUses: number | null;
    usesCount: number;
    expiresAt: Date | null;
    active: boolean;
  }) {
    if (!p.active) return null;
    if (p.expiresAt && p.expiresAt.getTime() < Date.now()) return null;
    if (p.maxUses !== null && p.usesCount >= p.maxUses) return null;
    return p;
  }

  /**
   * Atomically claim a use of the promo code. Returns true on success,
   * false if the code is exhausted or inactive in the meantime.
   */
  async claim(id: string): Promise<boolean> {
    const updated = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE "PromoCode"
      SET "usesCount" = "usesCount" + 1, "active" = "active"
      WHERE id = ${id}
        AND active = true
        AND ("maxUses" IS NULL OR "usesCount" < "maxUses")
        AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
    `);
    return updated > 0;
  }

  computeDiscount(subtotal: number, type: PromoCodeType, value: number): number {
    if (type === 'PERCENTAGE') {
      // value is in basis points (1000 = 10%)
      return Math.floor((subtotal * value) / 10000);
    }
    return Math.min(value, subtotal);
  }
}
