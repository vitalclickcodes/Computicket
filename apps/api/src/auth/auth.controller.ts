import { Body, Controller, Delete, Get, Ip, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class SignupDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() referralCode?: string;
}

class SigninDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) password!: string;
  @IsOptional() @IsString() totpCode?: string;
}

class Signin2FADto {
  @IsString() challengeToken!: string;
  @IsString() totpCode!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('signup')
  signup(@Body() dto: SignupDto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.signup(dto, { ip, userAgent: req.get('user-agent') ?? undefined });
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('signin')
  signin(@Body() dto: SigninDto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.signin(dto, { ip, userAgent: req.get('user-agent') ?? undefined });
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('signin/2fa')
  signin2FA(@Body() dto: Signin2FADto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.signin2FA(dto.challengeToken, dto.totpCode, {
      ip,
      userAgent: req.get('user-agent') ?? undefined,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return this.auth.me(req.user!.id);
  }
}
