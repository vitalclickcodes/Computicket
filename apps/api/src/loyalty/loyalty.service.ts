import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, LoyaltyTxType } from '@computicket/db';
import { PrismaService } from '../prisma/prisma.service';

// 1 point per NGN 100 spent (kobo / 10000)
export const POINTS_PER_KOBO_NUMER = 1;
export const POINTS_PER_KOBO_DENOM = 10000;
// 100 points = NGN 100 off (i.e. 100 kobo per point)
export const KOBO_PER_POINT = 100;

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  pointsForSpend(kobo: number): number {
    return Math.floor((kobo * POINTS_PER_KOBO_NUMER) / POINTS_PER_KOBO_DENOM);
  }

  koboForPoints(points: number): number {
    return points * KOBO_PER_POINT;
  }

  async getBalance(userId: string) {
    const u = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });
    return { points: u.loyaltyPoints };
  }

  async list(userId: string) {
    return this.prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async credit(
    tx: Prisma.TransactionClient,
    userId: string,
    points: number,
    type: LoyaltyTxType,
    note?: string,
    orderId?: string,
  ) {
    if (points <= 0) return null;
    const u = await tx.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: points } },
      select: { loyaltyPoints: true },
    });
    return tx.loyaltyTransaction.create({
      data: {
        userId,
        points,
        type,
        balanceAfter: u.loyaltyPoints,
        orderId,
        note,
      },
    });
  }

  /**
   * Atomic debit. Conditional UPDATE so we never go negative even under
   * concurrent redeem attempts at checkout.
   */
  async debit(
    tx: Prisma.TransactionClient,
    userId: string,
    points: number,
    note?: string,
    orderId?: string,
  ): Promise<{ ok: boolean; balanceAfter?: number }> {
    if (points <= 0) throw new BadRequestException('Redeem points must be positive');
    const claim = await tx.$executeRaw(Prisma.sql`
      UPDATE "User" SET "loyaltyPoints" = "loyaltyPoints" - ${points}, "updatedAt" = NOW()
      WHERE id = ${userId} AND "loyaltyPoints" >= ${points}
    `);
    if (claim === 0) return { ok: false };
    const u = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });
    await tx.loyaltyTransaction.create({
      data: {
        userId,
        points: -points,
        type: 'REDEEM',
        balanceAfter: u.loyaltyPoints,
        orderId,
        note,
      },
    });
    return { ok: true, balanceAfter: u.loyaltyPoints };
  }
}
