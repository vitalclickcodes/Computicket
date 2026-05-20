import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { RefundsService } from './refunds.service';

class RefundDto {
  @IsOptional() @IsInt() @Min(1) amountKobo?: number;
  @IsOptional() @IsString() reason?: string;
}

@ApiTags('refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/orders/:orderId/refund')
export class RefundsController {
  constructor(private readonly refunds: RefundsService) {}

  @Post()
  refund(
    @Param('orderId') orderId: string,
    @Body() dto: RefundDto,
    @Req() req: Request,
  ) {
    return this.refunds.refund({
      orderId,
      amountKobo: dto.amountKobo,
      reason: dto.reason,
      initiatedById: req.user!.id,
    });
  }
}
