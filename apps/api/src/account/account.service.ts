import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async listOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { userId },
          { user: { id: userId } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { slug: true, title: true, venue: true, city: true, startsAt: true } },
        tickets: { select: { id: true, code: true, status: true } },
      },
    });
    return orders.map((o) => ({
      id: o.id,
      status: o.status,
      totalKobo: o.totalKobo,
      paystackRef: o.paystackRef,
      paidAt: o.paidAt,
      createdAt: o.createdAt,
      event: o.event,
      ticketCount: o.tickets.length,
      tickets: o.tickets,
    }));
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
        tickets: { include: { ticketType: { select: { name: true } } } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    return order;
  }
}
