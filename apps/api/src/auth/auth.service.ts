import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const BCRYPT_ROUNDS = 12;

function generateReferralCode(): string {
  // 8-char URL-safe code, e.g. "AB3X7K9P"
  return randomBytes(6).toString('base64url').toUpperCase().slice(0, 8);
}

interface SignupInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  referralCode?: string;
}

interface SigninInput {
  email: string;
  password: string;
}

export interface AuthedUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signup(input: SignupInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing?.passwordHash) {
      throw new ConflictException('Email already registered');
    }

    // Resolve optional referral attribution. Unknown code is silently
    // ignored — we don't want to block signup over a typo.
    let referrer: { id: string } | null = null;
    if (input.referralCode) {
      referrer = await this.prisma.user.findUnique({
        where: { referralCode: input.referralCode.trim().toUpperCase() },
        select: { id: true },
      });
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const referralCode = await this.generateUniqueReferralCode();

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: input.name ?? existing.name,
            phone: input.phone ?? existing.phone,
            referralCode: existing.referralCode ?? referralCode,
            referredById: existing.referredById ?? referrer?.id,
          },
        })
      : await this.prisma.user.create({
          data: {
            email: input.email,
            passwordHash,
            name: input.name,
            phone: input.phone,
            referralCode,
            referredById: referrer?.id,
          },
        });

    // Record the pending referral row; the reward fires on the referee's
    // first paid order.
    if (referrer && referrer.id !== user.id) {
      await this.prisma.referral.upsert({
        where: { refereeId: user.id },
        update: {},
        create: { referrerId: referrer.id, refereeId: user.id },
      });
    }

    return this.issueToken(user);
  }

  private async generateUniqueReferralCode(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const code = generateReferralCode();
      const clash = await this.prisma.user.findUnique({ where: { referralCode: code } });
      if (!clash) return code;
    }
    // Astronomical collision odds, but tolerate it by appending random suffix.
    return generateReferralCode() + Date.now().toString(36).slice(-2).toUpperCase();
  }

  async signin(input: SigninInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid email or password');
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');
    return this.issueToken(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organizer: { select: { id: true, slug: true, name: true, status: true } },
          },
        },
      },
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      referralCode: user.referralCode,
      memberships: user.memberships.map((m) => ({
        role: m.role,
        organizer: m.organizer,
      })),
    };
  }

  async verifyToken(token: string): Promise<AuthedUser> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(token);
      return { id: payload.sub, email: payload.email };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async issueToken(user: { id: string; email: string; name: string | null }) {
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
