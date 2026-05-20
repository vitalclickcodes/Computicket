import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, Min } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AgentsService } from './agents.service';

class RegisterAgentDto {
  @IsEmail() email!: string;
  @IsOptional() @IsInt() @Min(0) commissionBps?: number;
}

@ApiTags('agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/agents')
export class AgentAdminController {
  constructor(private readonly agents: AgentsService) {}

  @Get()
  list() {
    return this.agents.list();
  }

  @Post()
  register(@Body() dto: RegisterAgentDto) {
    return this.agents.register(dto);
  }

  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.agents.deactivate(id);
  }
}

@ApiTags('agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/agent')
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Get('sales')
  sales(@Req() req: Request) {
    return this.agents.mySales(req.user!.id);
  }
}
