import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async list(organizerSlug: string, ticketTypeId: string) {
    await this.assertTtBelongsToOrganizer(organizerSlug, ticketTypeId);
    return this.prisma.pricingRule.findMany({
      where: { ticketTypeId },
      orderBy: { soldPercentThreshold: 'asc' },
    });
  }

  async create(
    organizerSlug: string,
    ticketTypeId: string,
    input: { soldPercentThreshold: number; priceAdjustmentBps: number },
  ) {
    await this.assertTtBelongsToOrganizer(organizerSlug, ticketTypeId);
    if (input.soldPercentThreshold < 0 || input.soldPercentThreshold > 100) {
      throw new BadRequestException('soldPercentThreshold must be 0–100');
    }
    if (Math.abs(input.priceAdjustmentBps) > 10000) {
      throw new BadRequestException('priceAdjustmentBps must be within ±10000 (±100%)');
    }
    return this.prisma.pricingRule.create({
      data: {
        ticketTypeId,
        soldPercentThreshold: input.soldPercentThreshold,
        priceAdjustmentBps: input.priceAdjustmentBps,
      },
    });
  }

  async deactivate(organizerSlug: string, id: string) {
    const rule = await this.prisma.pricingRule.findUnique({
      where: { id },
      select: { ticketTypeId: true },
    });
    if (!rule) throw new NotFoundException('Rule not found');
    await this.assertTtBelongsToOrganizer(organizerSlug, rule.ticketTypeId);
    return this.prisma.pricingRule.update({
      where: { id },
      data: { active: false },
      select: { id: true, active: true },
    });
  }

  /**
   * Compute the current price for a ticket type given its sold + held
   * inventory. Returns base price if no rule matches.
   */
  computePriceKobo(tt: {
    priceKobo: number;
    capacity: number;
    sold: number;
    held: number;
  }, rules: Array<{ soldPercentThreshold: number; priceAdjustmentBps: number; active: boolean }>): number {
    const utilisation = tt.capacity > 0 ? Math.floor(((tt.sold + tt.held) * 100) / tt.capacity) : 0;
    // Pick the rule with the highest threshold that the current
    // utilisation satisfies. Rules are applied as a single bps adjustment;
    // they don't stack.
    const applicable = rules
      .filter((r) => r.active && utilisation >= r.soldPercentThreshold)
      .sort((a, b) => b.soldPercentThreshold - a.soldPercentThreshold)[0];
    if (!applicable) return tt.priceKobo;
    const adjusted = Math.round((tt.priceKobo * (10000 + applicable.priceAdjustmentBps)) / 10000);
    // Floor at zero so weird configurations can't produce negative prices.
    return Math.max(0, adjusted);
  }

  /**
   * Fetch all active rules for a list of ticket-type IDs (used by the
   * order service during pricing).
   */
  async rulesForTicketTypes(ticketTypeIds: string[]) {
    return this.prisma.pricingRule.findMany({
      where: { ticketTypeId: { in: ticketTypeIds }, active: true },
    });
  }

  private async assertTtBelongsToOrganizer(organizerSlug: string, ticketTypeId: string) {
    const tt = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: { event: { include: { organizer: { select: { slug: true } } } } },
    });
    if (!tt || tt.event.organizer.slug !== organizerSlug) {
      throw new ForbiddenException('Ticket type does not belong to this organizer');
    }
  }
}
