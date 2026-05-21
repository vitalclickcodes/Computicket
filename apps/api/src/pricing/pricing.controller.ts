import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { PricingService } from './pricing.service';

class CreateRuleDto {
  @IsInt() @Min(0) @Max(100) soldPercentThreshold!: number;
  @IsInt() @Min(-10000) @Max(10000) priceAdjustmentBps!: number;
}

@ApiTags('pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/ticket-types/:ticketTypeId/pricing-rules')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Get()
  list(@Param('organizerSlug') slug: string, @Param('ticketTypeId') id: string) {
    return this.pricing.list(slug, id);
  }

  @Post()
  create(
    @Param('organizerSlug') slug: string,
    @Param('ticketTypeId') id: string,
    @Body() dto: CreateRuleDto,
  ) {
    return this.pricing.create(slug, id, dto);
  }

  @Delete(':ruleId')
  deactivate(@Param('organizerSlug') slug: string, @Param('ruleId') ruleId: string) {
    return this.pricing.deactivate(slug, ruleId);
  }
}
