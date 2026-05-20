import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SeatingService } from '../seating/seating.service';

@Injectable()
export class OrderExpiryService {
  private readonly logger = new Logger(OrderExpiryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seating: SeatingService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async runScheduled() {
    const expired = await this.expire(new Date());
    if (expired > 0) this.logger.log(`Expired ${expired} stale orders`);
  }

  /**
   * Mark every PENDING order with expiresAt < now as EXPIRED and release
   * its held inventory. Idempotent: each order is claimed by a
   * conditional update, so concurrent runs can't double-release.
   */
  async expire(now: Date): Promise<number> {
    const candidates = await this.prisma.order.findMany({
      where: { status: 'PENDING', expiresAt: { lt: now } },
      select: { id: true, items: { select: { ticketTypeId: true, quantity: true } } },
    });
    if (candidates.length === 0) return 0;

    let expiredCount = 0;
    for (const order of candidates) {
      await this.prisma.$transaction(async (tx) => {
        const claim = await tx.order.updateMany({
          where: { id: order.id, status: 'PENDING', expiresAt: { lt: now } },
          data: { status: 'EXPIRED' },
        });
        if (claim.count === 0) return; // someone else got it
        for (const item of order.items) {
          await tx.ticketType.update({
            where: { id: item.ticketTypeId },
            data: { held: { decrement: item.quantity } },
          });
        }
        await this.seating.releaseSeatsForOrder(tx, order.id);
        expiredCount += 1;
      });
    }
    return expiredCount;
  }
}
