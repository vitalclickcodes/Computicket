import { Body, Controller, Get, Ip, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SecurityService } from './security.service';

class PasswordResetRequestDto {
  @IsEmail() email!: string;
}

class PasswordResetConfirmDto {
  @IsString() token!: string;
  @IsString() @MinLength(8) newPassword!: string;
}

class EnableTotpDto {
  @IsString() code!: string;
}

class DisableTotpDto {
  @IsString() password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthSecurityController {
  constructor(private readonly security: SecurityService) {}

  // 5 requests per minute per IP; tight because email enumeration here.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('password-reset/request')
  async passwordResetRequest(@Body() dto: PasswordResetRequestDto, @Ip() ip: string) {
    return this.security.requestPasswordReset(dto.email, ip);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('password-reset/confirm')
  async passwordResetConfirm(@Body() dto: PasswordResetConfirmDto, @Ip() ip: string) {
    return this.security.confirmPasswordReset(dto.token, dto.newPassword, ip);
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get('verify-email/confirm')
  async verifyEmail(@Query('token') token: string, @Ip() ip: string) {
    return this.security.confirmEmail(token, ip);
  }
}

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/security')
export class AccountSecurityController {
  constructor(private readonly security: SecurityService) {}

  @Get()
  status(@Req() req: Request) {
    return this.security.statusFor(req.user!.id);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('email-verify/request')
  requestVerify(@Req() req: Request, @Ip() ip: string) {
    return this.security.sendEmailVerification(req.user!.id, ip);
  }

  @Post('2fa/setup')
  setupTotp(@Req() req: Request) {
    return this.security.setupTotp(req.user!.id);
  }

  @Post('2fa/enable')
  enableTotp(@Req() req: Request, @Body() dto: EnableTotpDto, @Ip() ip: string) {
    return this.security.enableTotp(req.user!.id, dto.code, ip);
  }

  @Post('2fa/disable')
  disableTotp(@Req() req: Request, @Body() dto: DisableTotpDto, @Ip() ip: string) {
    return this.security.disableTotp(req.user!.id, dto.password, ip);
  }
}

