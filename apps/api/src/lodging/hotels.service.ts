import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  search(params: { city?: string }) {
    return this.prisma.hotel.findMany({
      where: {
        active: true,
        ...(params.city ? { city: { equals: params.city, mode: 'insensitive' } } : {}),
      },
      orderBy: { name: 'asc' },
      take: 100,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.hotel.findUniqueOrThrow({ where: { slug } });
  }

  async create(
    organizerSlug: string,
    input: {
      slug: string;
      name: string;
      description?: string;
      city: string;
      address: string;
      pricePerNightKobo: number;
      capacity: number;
    },
  ) {
    const organizer = await this.prisma.organizer.findUnique({ where: { slug: organizerSlug } });
    if (!organizer) throw new NotFoundException('Organizer not found');
    return this.prisma.hotel.create({ data: { organizerId: organizer.id, ...input } });
  }

  listForOrganizer(organizerSlug: string) {
    return this.prisma.hotel.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
