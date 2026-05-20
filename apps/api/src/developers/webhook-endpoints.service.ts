import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export const SUPPORTED_EVENT_TYPES = [
  'order.paid',
  'order.refunded',
  'ticket.scanned',
] as const;

@Injectable()
export class WebhookEndpointsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    organizerSlug: string,
    input: { url: string; eventTypes: string[] },
  ) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { slug: organizerSlug },
    });
    if (!organizer) throw new NotFoundException(`Organizer "${organizerSlug}" not found`);

    const signingSecret = `whsec_${randomBytes(24).toString('base64url')}`;
    const created = await this.prisma.webhookEndpoint.create({
      data: {
        organizerId: organizer.id,
        url: input.url,
        eventTypes: input.eventTypes,
        signingSecret,
      },
    });

    // Signing secret is shown in full only on creation; subsequent reads
    // expose the last 4 chars for identification.
    return {
      ...this.publicView(created),
      signingSecret,
    };
  }

  async list(organizerSlug: string) {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: { organizer: { slug: organizerSlug } },
      orderBy: { createdAt: 'desc' },
    });
    return endpoints.map((e) => this.publicView(e));
  }

  async remove(organizerSlug: string, id: string) {
    const deleted = await this.prisma.webhookEndpoint.deleteMany({
      where: { id, organizer: { slug: organizerSlug } },
    });
    if (deleted.count === 0) throw new NotFoundException('Webhook endpoint not found');
    return { id, deleted: true };
  }

  private publicView(e: {
    id: string;
    url: string;
    eventTypes: string[];
    active: boolean;
    createdAt: Date;
    signingSecret: string;
  }) {
    return {
      id: e.id,
      url: e.url,
      eventTypes: e.eventTypes,
      active: e.active,
      createdAt: e.createdAt,
      signingSecretSuffix: e.signingSecret.slice(-4),
    };
  }
}
