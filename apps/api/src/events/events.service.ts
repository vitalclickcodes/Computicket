import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, EventType } from '@computicket/db';

interface CreateEventInput {
  organizerSlug: string;
  slug: string;
  title: string;
  description?: string;
  venue: string;
  city: string;
  startsAt: string;
  endsAt: string;
  ticketTypes: Array<{ name: string; priceKobo: number; capacity: number }>;
  type?: EventType;
  busRouteId?: string;
}

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateEventInput) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { slug: input.organizerSlug },
    });
    if (!organizer) throw new NotFoundException(`Organizer "${input.organizerSlug}" not found`);

    if (input.busRouteId) {
      const route = await this.prisma.busRoute.findUnique({
        where: { id: input.busRouteId },
      });
      if (!route || route.organizerId !== organizer.id) {
        throw new BadRequestException('Bus route not found for this organizer');
      }
    }

    return this.prisma.event.create({
      data: {
        organizerId: organizer.id,
        slug: input.slug,
        title: input.title,
        description: input.description,
        venue: input.venue,
        city: input.city,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        status: EventStatus.DRAFT,
        type: input.type ?? 'EVENT',
        busRouteId: input.busRouteId,
        ticketTypes: {
          create: input.ticketTypes.map((tt, i) => ({ ...tt, position: i + 1 })),
        },
      },
      include: { ticketTypes: true },
    });
  }

  listPublished(params: { city?: string; cursor?: string; limit?: number }) {
    return this.prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        type: 'EVENT',
        ...(params.city ? { city: { equals: params.city, mode: 'insensitive' } } : {}),
      },
      orderBy: { startsAt: 'asc' },
      take: params.limit ?? 20,
      ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
      include: {
        organizer: { select: { slug: true, name: true } },
        ticketTypes: { orderBy: { position: 'asc' } },
      },
    });
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: { select: { slug: true, name: true, description: true } },
        ticketTypes: { orderBy: { position: 'asc' } },
        busRoute: true,
      },
    });
    if (!event) throw new NotFoundException(`Event "${slug}" not found`);
    return event;
  }

  async publish(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: { organizer: { select: { status: true } } },
    });
    if (!event) throw new NotFoundException(`Event "${slug}" not found`);
    if (event.organizer.status !== 'APPROVED') {
      throw new ForbiddenException(
        'Organizer must be APPROVED by platform admin before publishing events',
      );
    }
    return this.prisma.event.update({
      where: { slug },
      data: { status: EventStatus.PUBLISHED },
    });
  }
}
