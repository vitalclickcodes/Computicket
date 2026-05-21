import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@computicket/db';
import { PrismaService } from '../prisma/prisma.service';

interface DayBucket {
  date: string; // YYYY-MM-DD in UTC
  orders: number;
  revenueKobo: number;
  ticketsSold: number;
}

interface HourBucket {
  hour: number; // 0..23 UTC
  orders: number;
}

interface AnalyticsOverview {
  organizer: { slug: string; name: string };
  range: { from: string; to: string; days: number };

  totals: {
    paidOrders: number;
    refundedOrders: number;
    grossKobo: number;
    refundedKobo: number;
    netKobo: number;
    ticketsSold: number;
    averageOrderKobo: number;
    refundRatePct: number;
  };

  daily: DayBucket[];
  ordersByHour: HourBucket[];

  topEvents: Array<{
    slug: string;
    title: string;
    sold: number;
    capacity: number;
    sellThroughPct: number;
    revenueKobo: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregate analytics over the last `days` days for one organizer.
   * Heavy lifting lives in two SQL aggregates (one for the daily
   * series, one for hour-of-day) so we don't shovel every Order row
   * into Node memory just to bucket it.
   */
  async forOrganizer(slug: string, days = 30): Promise<AnalyticsOverview> {
    const organizer = await this.prisma.organizer.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true },
    });
    if (!organizer) throw new NotFoundException('Organizer not found');

    const clampedDays = Math.min(Math.max(days, 1), 365);
    const to = new Date();
    const from = new Date(to.getTime() - clampedDays * 24 * 60 * 60 * 1000);

    // -------- Totals --------
    // Paid orders within the window: one aggregate covers count + sum,
    // and a follow-up query gets the ticket count (Order doesn't carry
    // a denormalised tickets count we can sum, but the Ticket table
    // has the issued ones).
    const [paidAgg, refundedAgg, ticketCountRow] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          status: 'PAID',
          paidAt: { gte: from, lte: to },
          event: { organizerId: organizer.id },
        },
        _count: { _all: true },
        _sum: { totalKobo: true },
      }),
      this.prisma.order.aggregate({
        where: {
          status: 'REFUNDED',
          paidAt: { gte: from, lte: to },
          event: { organizerId: organizer.id },
        },
        _count: { _all: true },
        _sum: { refundedKobo: true },
      }),
      this.prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
        SELECT COUNT(t."id")::bigint AS count
        FROM "Ticket" t
        JOIN "Order" o ON o."id" = t."orderId"
        JOIN "Event" e ON e."id" = o."eventId"
        WHERE e."organizerId" = ${organizer.id}
          AND o."status" IN ('PAID', 'REFUNDED')
          AND o."paidAt" >= ${from}
          AND o."paidAt" <= ${to}
      `),
    ]);

    const paidCount = paidAgg._count._all;
    const refundedCount = refundedAgg._count._all;
    const grossKobo = paidAgg._sum.totalKobo ?? 0;
    const refundedKobo = refundedAgg._sum.refundedKobo ?? 0;
    const ticketsSold = Number(ticketCountRow[0]?.count ?? 0n);
    const denominator = paidCount + refundedCount;

    // -------- Daily series --------
    // date_trunc('day') in UTC gives stable buckets regardless of the
    // server's timezone. We left-join a generated series so days with
    // zero orders still appear in the response (and render as a flat
    // segment on the chart).
    const daily = await this.prisma.$queryRaw<Array<{
      day: Date;
      orders: bigint;
      revenue: bigint | null;
      tickets: bigint;
    }>>(Prisma.sql`
      WITH day_series AS (
        SELECT generate_series(
          date_trunc('day', ${from}::timestamptz),
          date_trunc('day', ${to}::timestamptz),
          INTERVAL '1 day'
        )::date AS day
      )
      SELECT
        ds.day,
        COUNT(o."id")::bigint AS orders,
        SUM(o."totalKobo")::bigint AS revenue,
        COUNT(t."id")::bigint AS tickets
      FROM day_series ds
      LEFT JOIN "Order" o
        ON date_trunc('day', o."paidAt") = ds.day
        AND o."status" = 'PAID'
        AND o."eventId" IN (SELECT "id" FROM "Event" WHERE "organizerId" = ${organizer.id})
      LEFT JOIN "Ticket" t ON t."orderId" = o."id"
      GROUP BY ds.day
      ORDER BY ds.day ASC
    `);

    // -------- Hour-of-day distribution --------
    const hourly = await this.prisma.$queryRaw<Array<{ hour: number; orders: bigint }>>(Prisma.sql`
      SELECT EXTRACT(HOUR FROM o."paidAt")::int AS hour,
             COUNT(*)::bigint AS orders
      FROM "Order" o
      JOIN "Event" e ON e."id" = o."eventId"
      WHERE e."organizerId" = ${organizer.id}
        AND o."status" = 'PAID'
        AND o."paidAt" >= ${from}
        AND o."paidAt" <= ${to}
      GROUP BY hour
      ORDER BY hour ASC
    `);
    const hourMap = new Map(hourly.map((r) => [r.hour, Number(r.orders)]));
    const ordersByHour: HourBucket[] = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      orders: hourMap.get(h) ?? 0,
    }));

    // -------- Top events --------
    const topEvents = await this.prisma.$queryRaw<Array<{
      slug: string;
      title: string;
      sold: number;
      capacity: bigint;
      revenue: bigint | null;
    }>>(Prisma.sql`
      SELECT
        e.slug, e.title,
        COALESCE(SUM(tt.sold), 0)::int AS sold,
        COALESCE(SUM(tt.capacity), 0)::bigint AS capacity,
        (
          SELECT SUM(o."totalKobo")::bigint
          FROM "Order" o
          WHERE o."eventId" = e."id"
            AND o."status" = 'PAID'
            AND o."paidAt" >= ${from}
            AND o."paidAt" <= ${to}
        ) AS revenue
      FROM "Event" e
      LEFT JOIN "TicketType" tt ON tt."eventId" = e."id"
      WHERE e."organizerId" = ${organizer.id}
      GROUP BY e."id", e.slug, e.title
      ORDER BY revenue DESC NULLS LAST
      LIMIT 5
    `);

    return {
      organizer: { slug: organizer.slug, name: organizer.name },
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
        days: clampedDays,
      },
      totals: {
        paidOrders: paidCount,
        refundedOrders: refundedCount,
        grossKobo,
        refundedKobo,
        netKobo: grossKobo - refundedKobo,
        ticketsSold,
        averageOrderKobo: paidCount === 0 ? 0 : Math.round(grossKobo / paidCount),
        refundRatePct: denominator === 0 ? 0 : Math.round((refundedCount / denominator) * 1000) / 10,
      },
      daily: daily.map((d) => ({
        date: d.day.toISOString().slice(0, 10),
        orders: Number(d.orders),
        revenueKobo: Number(d.revenue ?? 0n),
        ticketsSold: Number(d.tickets),
      })),
      ordersByHour,
      topEvents: topEvents.map((e) => {
        const capacity = Number(e.capacity);
        return {
          slug: e.slug,
          title: e.title,
          sold: e.sold,
          capacity,
          sellThroughPct: capacity === 0 ? 0 : Math.round((e.sold / capacity) * 1000) / 10,
          revenueKobo: Number(e.revenue ?? 0n),
        };
      }),
    };
  }
}
