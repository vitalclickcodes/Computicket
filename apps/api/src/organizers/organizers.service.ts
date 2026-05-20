import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizerStatus } from '@computicket/db';

interface CreateOrganizerInput {
  name: string;
  slug: string;
  description?: string;
  ownerUserId: string;
}

@Injectable()
export class OrganizersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateOrganizerInput) {
    const existing = await this.prisma.organizer.findUnique({ where: { slug: input.slug } });
    if (existing) throw new ConflictException(`Organizer slug "${input.slug}" already taken`);

    return this.prisma.organizer.create({
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        status: OrganizerStatus.PENDING,
        members: { create: { userId: input.ownerUserId, role: 'OWNER' } },
      },
      include: { members: true },
    });
  }

  list() {
    return this.prisma.organizer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { events: true } } },
    });
  }

  async findBySlug(slug: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { slug },
      include: { events: { where: { status: 'PUBLISHED' } } },
    });
    if (!organizer) throw new NotFoundException(`Organizer "${slug}" not found`);
    return organizer;
  }
}
