import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoute(
    organizerSlug: string,
    input: { fromCity: string; toCity: string; durationMinutes: number },
  ) {
    if (input.fromCity.trim().toLowerCase() === input.toCity.trim().toLowerCase()) {
      throw new BadRequestException('fromCity and toCity must differ');
    }
    const organizer = await this.prisma.organizer.findUnique({
      where: { slug: organizerSlug },
    });
    if (!organizer) throw new NotFoundException('Organizer not found');
    return this.prisma.busRoute.create({
      data: {
        organizerId: organizer.id,
        fromCity: input.fromCity.trim(),
        toCity: input.toCity.trim(),
        durationMinutes: input.durationMinutes,
      },
    });
  }

  async listOrganizerRoutes(organizerSlug: string) {
    return this.prisma.busRoute.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { trips: true } } },
    });
  }

  async deactivateRoute(organizerSlug: string, id: string) {
    const updated = await this.prisma.busRoute.updateMany({
      where: { id, organizer: { slug: organizerSlug } },
      data: { active: false },
    });
    if (updated.count === 0) throw new NotFoundException('Route not found');
    return { id, active: false };
  }

  /**
   * Public search. Lists currently-PUBLISHED bus-trip events matching
   * fromCity/toCity (case-insensitive) and optionally a same-day filter
   * on departure.
   */
  async searchTrips(params: { from?: string; to?: string; date?: string }) {
    const dayStart = params.date ? new Date(`${params.date}T00:00:00Z`) : new Date();
    const dayEnd = params.date
      ? new Date(`${params.date}T23:59:59.999Z`)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // next 60 days

    const trips = await this.prisma.event.findMany({
      where: {
        type: 'BUS_TRIP',
        status: 'PUBLISHED',
        startsAt: { gte: dayStart, lte: dayEnd },
        busRoute: {
          active: true,
          ...(params.from
            ? { fromCity: { equals: params.from, mode: 'insensitive' } }
            : {}),
          ...(params.to
            ? { toCity: { equals: params.to, mode: 'insensitive' } }
            : {}),
        },
      },
      orderBy: { startsAt: 'asc' },
      include: {
        busRoute: true,
        organizer: { select: { slug: true, name: true } },
        ticketTypes: { orderBy: { position: 'asc' } },
      },
      take: 100,
    });

    return trips.map((t) => ({
      slug: t.slug,
      title: t.title,
      departsAt: t.startsAt,
      arrivesAt: t.endsAt,
      boardingTerminal: t.venue,
      organizer: t.organizer,
      route: t.busRoute
        ? {
            fromCity: t.busRoute.fromCity,
            toCity: t.busRoute.toCity,
            durationMinutes: t.busRoute.durationMinutes,
          }
        : null,
      ticketTypes: t.ticketTypes.map((tt) => ({
        id: tt.id,
        name: tt.name,
        priceKobo: tt.priceKobo,
        capacity: tt.capacity,
        sold: tt.sold,
      })),
    }));
  }

  async listCities() {
    const routes = await this.prisma.busRoute.findMany({
      where: { active: true },
      select: { fromCity: true, toCity: true },
    });
    const cities = new Set<string>();
    for (const r of routes) {
      cities.add(r.fromCity);
      cities.add(r.toCity);
    }
    return { cities: [...cities].sort() };
  }
}
