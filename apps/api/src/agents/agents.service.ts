import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

function generateAgentCode(): string {
  // 6-char code like AGT-XKW3Q
  return `AGT-${randomBytes(3).toString('base64url').toUpperCase().slice(0, 5)}`;
}

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const agents = await this.prisma.agentProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    });
    // Attach sales counts.
    const sales = await this.prisma.order.groupBy({
      by: ['agentCode'],
      where: { status: 'PAID', agentCode: { in: agents.map((a) => a.agentCode) } },
      _count: { _all: true },
      _sum: { totalKobo: true, agentCommissionKobo: true },
    });
    const byCode = new Map(sales.map((s) => [s.agentCode!, s]));
    return agents.map((a) => ({
      id: a.id,
      agentCode: a.agentCode,
      commissionBps: a.commissionBps,
      active: a.active,
      user: a.user,
      paidOrders: byCode.get(a.agentCode)?._count._all ?? 0,
      grossKobo: byCode.get(a.agentCode)?._sum.totalKobo ?? 0,
      commissionEarnedKobo: byCode.get(a.agentCode)?._sum.agentCommissionKobo ?? 0,
    }));
  }

  async register(input: { email: string; commissionBps?: number }) {
    if (input.commissionBps !== undefined && (input.commissionBps < 0 || input.commissionBps > 3000)) {
      throw new BadRequestException('commissionBps must be 0–3000 (0–30%)');
    }
    const user = await this.prisma.user.upsert({
      where: { email: input.email },
      update: {},
      create: { email: input.email },
    });
    const existing = await this.prisma.agentProfile.findUnique({ where: { userId: user.id } });
    if (existing) throw new BadRequestException(`${input.email} is already an agent`);

    for (let i = 0; i < 5; i++) {
      const code = generateAgentCode();
      const clash = await this.prisma.agentProfile.findUnique({ where: { agentCode: code } });
      if (clash) continue;
      return this.prisma.agentProfile.create({
        data: {
          userId: user.id,
          agentCode: code,
          commissionBps: input.commissionBps ?? 500,
        },
      });
    }
    throw new BadRequestException('Could not generate a unique agent code, please retry');
  }

  async deactivate(id: string) {
    const updated = await this.prisma.agentProfile.updateMany({
      where: { id },
      data: { active: false },
    });
    if (updated.count === 0) throw new NotFoundException('Agent not found');
    return { id, active: false };
  }

  /**
   * Resolve an agent by code for order attribution. Returns null if the
   * code is unknown or the agent is inactive.
   */
  async resolveAgentCode(code: string) {
    const a = await this.prisma.agentProfile.findUnique({
      where: { agentCode: code.trim().toUpperCase() },
    });
    if (!a || !a.active) return null;
    return { agentCode: a.agentCode, userId: a.userId, commissionBps: a.commissionBps };
  }

  /**
   * Sales feed for the agent's own dashboard.
   */
  async mySales(userId: string) {
    const profile = await this.prisma.agentProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Not an agent');
    const orders = await this.prisma.order.findMany({
      where: { agentCode: profile.agentCode, status: 'PAID' },
      orderBy: { paidAt: 'desc' },
      include: { event: { select: { slug: true, title: true } } },
      take: 100,
    });
    const totalCommission = orders.reduce((acc, o) => acc + o.agentCommissionKobo, 0);
    return {
      profile,
      totalCommissionKobo: totalCommission,
      orders: orders.map((o) => ({
        id: o.id,
        paidAt: o.paidAt,
        totalKobo: o.totalKobo,
        agentCommissionKobo: o.agentCommissionKobo,
        event: o.event,
      })),
    };
  }
}
