import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoyaltyService } from './loyalty.service';

@ApiTags('loyalty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/loyalty')
export class LoyaltyController {
  constructor(private readonly loyalty: LoyaltyService) {}

  @Get()
  async overview(@Req() req: Request) {
    const userId = req.user!.id;
    const [{ points }, transactions] = await Promise.all([
      this.loyalty.getBalance(userId),
      this.loyalty.list(userId),
    ]);
    return { points, transactions };
  }
}
