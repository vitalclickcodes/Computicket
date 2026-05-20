import { Injectable, Logger } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const TIMEOUT_MS = 5000;
const USER_AGENT = 'Computicket-Webhooks/1.0';

interface DispatchInput {
  organizerId: string;
  event: 'order.paid' | 'order.refunded' | 'ticket.scanned';
  data: Record<string, unknown>;
}

@Injectable()
export class WebhookDispatcher {
  private readonly logger = new Logger(WebhookDispatcher.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fire webhook deliveries to every active endpoint of the organizer
   * subscribed to the event. Deliveries run in parallel and never throw —
   * caller may safely await without affecting the user flow.
   */
  async dispatch(input: DispatchInput): Promise<{ attempted: number; delivered: number }> {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: {
        organizerId: input.organizerId,
        active: true,
        eventTypes: { has: input.event },
      },
    });
    if (endpoints.length === 0) return { attempted: 0, delivered: 0 };

    const eventId = `evt_${randomBytes(12).toString('hex')}`;
    const payload = JSON.stringify({
      id: eventId,
      event: input.event,
      createdAt: new Date().toISOString(),
      data: input.data,
    });

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        const signature = createHmac('sha256', endpoint.signingSecret).update(payload).digest('hex');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
          const res = await fetch(endpoint.url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'user-agent': USER_AGENT,
              'x-computicket-event': input.event,
              'x-computicket-event-id': eventId,
              'x-computicket-signature': signature,
            },
            body: payload,
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (!res.ok) {
            this.logger.warn(
              `Webhook ${endpoint.id} -> ${endpoint.url}: HTTP ${res.status} for ${input.event}`,
            );
            return false;
          }
          this.logger.log(
            `Delivered ${input.event} (${eventId}) to ${endpoint.url} -> ${res.status}`,
          );
          return true;
        } catch (e) {
          clearTimeout(timer);
          this.logger.warn(
            `Webhook ${endpoint.id} -> ${endpoint.url} failed: ${(e as Error).message}`,
          );
          return false;
        }
      }),
    );

    return {
      attempted: endpoints.length,
      delivered: results.filter(Boolean).length,
    };
  }
}
