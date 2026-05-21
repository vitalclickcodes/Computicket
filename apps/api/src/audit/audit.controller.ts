import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from './audit.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/audit-log')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @Query('action') action?: string,
    @Query('actorUserId') actorUserId?: string,
    @Query('take') take?: string,
  ) {
    return this.audit.list({
      action,
      actorUserId,
      take: take ? Number(take) : undefined,
    });
  }
}
