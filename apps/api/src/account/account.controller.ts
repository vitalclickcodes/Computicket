import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountService } from './account.service';

@ApiTags('account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Get('orders')
  list(@Req() req: Request) {
    return this.account.listOrders(req.user!.id);
  }

  @Get('orders/:id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.account.getOrder(req.user!.id, id);
  }
}
