import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(private readonly prisma: PrismaService) {}

  search(params: { from?: string; to?: string; date?: string }) {
    const dayStart = params.date ? new Date(`${params.date}T00:00:00Z`) : new Date();
    const dayEnd = params.date
      ? new Date(`${params.date}T23:59:59.999Z`)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // next 30 days
    return this.prisma.flight.findMany({
      where: {
        active: true,
        departsAt: { gte: dayStart, lte: dayEnd },
        ...(params.from ? { fromAirport: { equals: params.from, mode: 'insensitive' } } : {}),
        ...(params.to ? { toAirport: { equals: params.to, mode: 'insensitive' } } : {}),
      },
      orderBy: { departsAt: 'asc' },
      take: 100,
    });
  }

  async create(
    organizerSlug: string,
    input: {
      flightNumber: string;
      airline: string;
      fromAirport: string;
      toAirport: string;
      departsAt: string;
      arrivesAt: string;
      priceKobo: number;
      capacity: number;
    },
  ) {
    const organizer = await this.prisma.organizer.findUnique({ where: { slug: organizerSlug } });
    if (!organizer) throw new NotFoundException('Organizer not found');
    return this.prisma.flight.create({
      data: {
        organizerId: organizer.id,
        ...input,
        departsAt: new Date(input.departsAt),
        arrivesAt: new Date(input.arrivesAt),
      },
    });
  }

  listForOrganizer(organizerSlug: string) {
    return this.prisma.flight.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { departsAt: 'asc' },
    });
  }
}
