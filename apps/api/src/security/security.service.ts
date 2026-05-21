import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
} from 'crypto';
import { authenticator } from 'otplib';
import { MailerService } from '../mail/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

const EMAIL_VERIFY_TTL_MIN = 60 * 24; // 24 hours
const PASSWORD_RESET_TTL_MIN = 60; // 1 hour
const BCRYPT_ROUNDS = 12;

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

function appKey(): Buffer {
  const material = process.env.APP_KEY ?? process.env.JWT_SECRET ?? 'dev_unsafe';
  return scryptSync(material, 'computicket-totp', 32);
}

function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', appKey(), iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

function decryptSecret(blob: string): string {
  const buf = Buffer.from(blob, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', appKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

function webBaseUrl(): string {
  return process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000';
}

@Injectable()
export class SecurityService implements OnModuleInit {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly audit: AuditService,
    private readonly auth: AuthService,
  ) {}

  onModuleInit() {
    this.auth.setTotpVerifier((userId, code) => this.verifyTotpForSignin(userId, code));
  }

  // ---------- Email verification ----------

  async sendEmailVerification(userId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerifiedAt: true, name: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.emailVerifiedAt) return { sent: false, alreadyVerified: true };

    const token = randomBytes(32).toString('base64url');
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + EMAIL_VERIFY_TTL_MIN * 60_000),
      },
    });
    const link = `${webBaseUrl()}/verify-email?token=${token}`;
    await this.mailer.sendEmailVerification({
      to: user.email,
      name: user.name,
      link,
    });
    await this.audit.record({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'auth.email_verify.requested',
      ip,
    });
    return { sent: true };
  }

  async confirmEmail(token: string, ip?: string) {
    if (!token) throw new BadRequestException('Missing token');
    const row = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: sha256(token) },
    });
    if (!row) throw new UnauthorizedException('Invalid token');
    if (row.usedAt) throw new UnauthorizedException('Token already used');
    if (row.expiresAt.getTime() < Date.now()) throw new UnauthorizedException('Token expired');

    // Burn the token first to neutralise replay races, then mark the user.
    const burn = await this.prisma.emailVerificationToken.updateMany({
      where: { id: row.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (burn.count === 0) throw new UnauthorizedException('Token already used');
    const user = await this.prisma.user.update({
      where: { id: row.userId },
      data: { emailVerifiedAt: new Date() },
      select: { id: true, email: true },
    });
    await this.audit.record({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'auth.email_verify.confirmed',
      ip,
    });
    return { verified: true };
  }

  // ---------- Password reset ----------

  async requestPasswordReset(email: string, ip?: string) {
    // Always return success so we don't leak which emails are registered.
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, deletedAt: true },
    });
    if (!user || user.deletedAt) return { sent: true };

    const token = randomBytes(32).toString('base64url');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MIN * 60_000),
      },
    });
    const link = `${webBaseUrl()}/reset-password?token=${token}`;
    await this.mailer.sendPasswordReset({ to: user.email, name: user.name, link });
    await this.audit.record({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'auth.password_reset.requested',
      ip,
    });
    return { sent: true };
  }

  async confirmPasswordReset(token: string, newPassword: string, ip?: string) {
    if (!token) throw new BadRequestException('Missing token');
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    const row = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: sha256(token) },
    });
    if (!row) throw new UnauthorizedException('Invalid token');
    if (row.usedAt) throw new UnauthorizedException('Token already used');
    if (row.expiresAt.getTime() < Date.now()) throw new UnauthorizedException('Token expired');

    const burn = await this.prisma.passwordResetToken.updateMany({
      where: { id: row.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (burn.count === 0) throw new UnauthorizedException('Token already used');

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    const user = await this.prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
      select: { id: true, email: true },
    });
    // Best practice: invalidate all outstanding password-reset tokens for
    // this user so a stolen second link can't be used.
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: row.userId, usedAt: null },
      data: { usedAt: new Date() },
    });
    await this.audit.record({
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'auth.password_reset.confirmed',
      ip,
    });
    return { reset: true };
  }

  // ---------- 2FA (TOTP) ----------

  async setupTotp(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.totpEnabledAt) {
      throw new ConflictException('2FA is already enabled. Disable it before re-enrolling.');
    }
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecretEnc: encryptSecret(secret), totpEnabledAt: null },
    });
    const otpauth = authenticator.keyuri(user.email, 'Computicket Nigeria', secret);
    return { secret, otpauthUri: otpauth };
  }

  async enableTotp(userId: string, code: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, totpSecretEnc: true, totpEnabledAt: true },
    });
    if (!user?.totpSecretEnc) {
      throw new BadRequestException('Run setup first to provision a TOTP secret');
    }
    if (user.totpEnabledAt) throw new ConflictException('2FA is already enabled');
    const secret = decryptSecret(user.totpSecretEnc);
    if (!authenticator.verify({ token: code, secret })) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabledAt: new Date() },
    });
    await this.audit.record({
      actorUserId: userId,
      actorEmail: user.email,
      action: 'auth.2fa.enabled',
      ip,
    });
    return { enabled: true };
  }

  async disableTotp(userId: string, password: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, passwordHash: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.totpEnabledAt) return { disabled: true };
    if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Wrong password');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecretEnc: null, totpEnabledAt: null },
    });
    await this.audit.record({
      actorUserId: userId,
      actorEmail: user.email,
      action: 'auth.2fa.disabled',
      ip,
    });
    return { disabled: true };
  }

  /**
   * Called from auth.signin: returns true iff this user has 2FA enabled
   * and `code` matches their current TOTP. Used to gate token issuance.
   */
  async verifyTotpForSignin(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totpSecretEnc: true, totpEnabledAt: true },
    });
    if (!user?.totpEnabledAt || !user.totpSecretEnc) return true; // 2FA not set
    if (!code) return false;
    const secret = decryptSecret(user.totpSecretEnc);
    return authenticator.verify({ token: code, secret });
  }

  async statusFor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerifiedAt: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      emailVerified: !!user.emailVerifiedAt,
      emailVerifiedAt: user.emailVerifiedAt,
      totpEnabled: !!user.totpEnabledAt,
      totpEnabledAt: user.totpEnabledAt,
    };
  }
}
