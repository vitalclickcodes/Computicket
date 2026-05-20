import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@computicket/db';
import { PrismaService } from '../prisma/prisma.service';

export interface SeatRow {
  row: string;
  seats: string[];
}

@Injectable()
export class SeatingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a seat map for a ticket type. Capacity must match the total
   * seat count. Replaces any existing seats — fails if any seat is
   * currently HELD or SOLD.
   */
  async setSeatMap(ticketTypeId: string, rows: SeatRow[]) {
    if (!rows.length) throw new BadRequestException('Seat map must contain at least one row');
    const totalSeats = rows.reduce((acc, r) => acc + r.seats.length, 0);

    const tt = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: { seats: true },
    });
    if (!tt) throw new NotFoundException('Ticket type not found');
    if (tt.capacity !== totalSeats) {
      throw new BadRequestException(`Capacity ${tt.capacity} does not match seat count ${totalSeats}`);
    }
    if (tt.seats.some((s) => s.status !== 'AVAILABLE')) {
      throw new BadRequestException('Cannot reshape a seat map while seats are held or sold');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({ where: { ticketTypeId } });
      const data = rows.flatMap((r) =>
        r.seats.map((label) => ({ ticketTypeId, row: r.row, label })),
      );
      await tx.seat.createMany({ data });
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: { seatMap: rows as unknown as Prisma.InputJsonValue },
      });
    });
    return { rows, totalSeats };
  }

  async listSeatsForTicketType(ticketTypeId: string) {
    const seats = await this.prisma.seat.findMany({
      where: { ticketTypeId },
      orderBy: [{ row: 'asc' }, { label: 'asc' }],
      select: { id: true, row: true, label: true, status: true },
    });
    return seats;
  }

  /**
   * Atomic seat hold. Claims each requested seat only if AVAILABLE.
   * Returns the list of held seat IDs or null if any seat couldn't be
   * claimed (in which case any partial holds are released).
   */
  async holdSeats(
    tx: Prisma.TransactionClient,
    ticketTypeId: string,
    seatIds: string[],
    orderId: string,
  ): Promise<string[] | null> {
    const claimed: string[] = [];
    for (const seatId of seatIds) {
      const updated = await tx.seat.updateMany({
        where: { id: seatId, ticketTypeId, status: 'AVAILABLE' },
        data: { status: 'HELD', heldByOrderId: orderId },
      });
      if (updated.count === 0) {
        // Release anything we already grabbed.
        if (claimed.length > 0) {
          await tx.seat.updateMany({
            where: { id: { in: claimed } },
            data: { status: 'AVAILABLE', heldByOrderId: null },
          });
        }
        return null;
      }
      claimed.push(seatId);
    }
    return claimed;
  }

  /**
   * Mark held seats as SOLD and link to issued tickets. Called from the
   * ticket-issuance path when an order containing seated items is paid.
   */
  async sellHeldSeats(
    tx: Prisma.TransactionClient,
    orderId: string,
    ticketsByItem: Array<{ ticketTypeId: string; ticketIds: string[] }>,
  ) {
    for (const item of ticketsByItem) {
      const heldSeats = await tx.seat.findMany({
        where: { ticketTypeId: item.ticketTypeId, heldByOrderId: orderId, status: 'HELD' },
        take: item.ticketIds.length,
      });
      for (let i = 0; i < heldSeats.length && i < item.ticketIds.length; i++) {
        const seat = heldSeats[i]!;
        const ticketId = item.ticketIds[i]!;
        await tx.seat.update({
          where: { id: seat.id },
          data: { status: 'SOLD', ticketId, heldByOrderId: null },
        });
      }
    }
  }

  /**
   * Release any seats currently held by this order. Used by order
   * expiry and refund-finalisation paths.
   */
  async releaseSeatsForOrder(tx: Prisma.TransactionClient, orderId: string) {
    await tx.seat.updateMany({
      where: { heldByOrderId: orderId, status: 'HELD' },
      data: { status: 'AVAILABLE', heldByOrderId: null },
    });
  }

  async voidSeatsForOrder(tx: Prisma.TransactionClient, orderId: string) {
    // On refund, sold seats go back to AVAILABLE so capacity is restored
    // (matches how we currently decrement TicketType.sold on refund).
    const ticketsInOrder = await tx.ticket.findMany({
      where: { orderId },
      select: { id: true },
    });
    if (ticketsInOrder.length === 0) return;
    await tx.seat.updateMany({
      where: { ticketId: { in: ticketsInOrder.map((t) => t.id) } },
      data: { status: 'AVAILABLE', ticketId: null },
    });
  }
}
