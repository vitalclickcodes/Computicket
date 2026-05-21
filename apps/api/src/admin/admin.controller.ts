import { Body, Controller, Get, Ip, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';

class SetCommissionDto {
  @IsInt() @Min(0) @Max(5000) bps!: number;
}

class SetKycNotesDto {
  @IsString() notes!: string;
}

class SetKycTierDto {
  @IsEnum(['NONE', 'BASIC', 'VERIFIED']) tier!: 'NONE' | 'BASIC' | 'VERIFIED';
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.platformStats();
  }

  @Get('organizers')
  list() {
    return this.admin.listOrganizers();
  }

  @Post('organizers/:slug/approve')
  approve(@Param('slug') slug: string, @Req() req: Request, @Ip() ip: string) {
    return this.admin.approve(slug, req.user!.id, req.user!.email, ip);
  }

  @Post('organizers/:slug/suspend')
  suspend(@Param('slug') slug: string, @Req() req: Request, @Ip() ip: string) {
    return this.admin.suspend(slug, req.user!.id, req.user!.email, ip);
  }

  @Patch('organizers/:slug/commission')
  setCommission(
    @Param('slug') slug: string,
    @Body() dto: SetCommissionDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.admin.setCommission(slug, dto.bps, req.user!.id, req.user!.email, ip);
  }

  @Patch('organizers/:slug/kyc-notes')
  setKycNotes(
    @Param('slug') slug: string,
    @Body() dto: SetKycNotesDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.admin.setKycNotes(slug, dto.notes, req.user!.id, req.user!.email, ip);
  }

  @Get('wallet-kyc')
  listPendingKyc() {
    return this.admin.listPendingKyc();
  }

  @Patch('users/:userId/kyc-tier')
  setUserKycTier(@Param('userId') userId: string, @Body() dto: SetKycTierDto) {
    return this.admin.setKycTier(userId, dto.tier);
  }
}
