import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrivacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * NDPR-compliant data export. Returns everything we hold tied to this
   * user — profile, orders, tickets, wallet movements, referrals — as a
   * single JSON document.
   */
  async export(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            event: { select: { slug: true, title: true } },
            items: true,
            tickets: { select: { id: true, code: true, status: true, createdAt: true } },
          },
        },
        memberships: {
          include: { organizer: { select: { slug: true, name: true } } },
        },
        walletTransactions: true,
        walletTopUps: true,
        loyaltyTransactions: true,
        referralsMade: true,
        referralReceived: true,
        agentProfile: true,
        corporateMemberships: {
          include: { account: { select: { id: true, name: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      generatedAt: new Date().toISOString(),
      profile: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        createdAt: user.createdAt,
        emailVerifiedAt: user.emailVerifiedAt,
        kycTier: user.kycTier,
        kycBvn: user.kycBvn,
        referralCode: user.referralCode,
      },
      orders: user.orders.map((o) => ({
        id: o.id,
        status: o.status,
        totalKobo: o.totalKobo,
        paystackRef: o.paystackRef,
        paidAt: o.paidAt,
        createdAt: o.createdAt,
        event: o.event,
        items: o.items,
        tickets: o.tickets,
      })),
      memberships: user.memberships.map((m) => ({ role: m.role, organizer: m.organizer })),
      wallet: {
        balanceKobo: user.walletBalanceKobo,
        transactions: user.walletTransactions,
        topUps: user.walletTopUps,
      },
      loyalty: { points: user.loyaltyPoints, transactions: user.loyaltyTransactions },
      referrals: {
        made: user.referralsMade,
        received: user.referralReceived,
      },
      agentProfile: user.agentProfile,
      corporate: user.corporateMemberships,
    };
  }

  /**
   * NDPR right-to-erasure. We do *not* hard-delete: order rows must
   * survive for accounting and tax. Instead we scrub PII and mark the
   * account closed. The next signin attempt fails with "Account closed".
   */
  async deleteAccount(userId: string, password: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        deletedAt: true,
        memberships: { select: { id: true, role: true, organizerId: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.deletedAt) return { deleted: true, alreadyDeleted: true };
    if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Wrong password');
    }

    // Don't delete owners of active organizers — they must hand off first.
    const owns = user.memberships.filter((m) => m.role === 'OWNER');
    if (owns.length > 0) {
      throw new BadRequestException(
        'You own an organizer account. Transfer ownership before deleting your user account.',
      );
    }

    const tag = `deleted-${user.id}@anonymous.computicket.ng`;
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: tag,
          phone: null,
          name: null,
          passwordHash: null,
          totpSecretEnc: null,
          totpEnabledAt: null,
          kycBvn: null,
          kycIdNumber: null,
          kycIdDocumentUrl: null,
          deletedAt: new Date(),
        },
      }),
      this.prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.oAuthAccessToken.deleteMany({ where: { userId: user.id } }),
      this.prisma.oAuthAuthorizationCode.deleteMany({ where: { userId: user.id } }),
    ]);
    await this.audit.record({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'privacy.account.deleted',
      ip,
    });
    return { deleted: true };
  }
}
