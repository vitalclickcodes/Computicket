import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@computicket/db';
import { PrismaService } from '../prisma/prisma.service';

interface RecordInput {
  actorUserId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Append-only audit log. Never throws — losing one log line is bad,
   * but failing the underlying action because of an audit insert is worse.
   */
  async record(input: RecordInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: input.actorUserId ?? null,
          actorEmail: input.actorEmail ?? null,
          action: input.action,
          targetType: input.targetType ?? null,
          targetId: input.targetId ?? null,
          metadata: input.metadata ?? undefined,
          ip: input.ip ?? null,
        },
      });
    } catch (err: unknown) {
      this.logger.error(
        `Audit insert failed for action=${input.action}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async list(params: { take?: number; action?: string; actorUserId?: string }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(params.action ? { action: params.action } : {}),
        ...(params.actorUserId ? { actorUserId: params.actorUserId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(params.take ?? 100, 500),
    });
  }
}
