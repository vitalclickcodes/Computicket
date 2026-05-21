import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { AnalyticsService } from './analytics.service';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug')
export class DashboardController {
  constructor(
    private readonly dashboard: DashboardService,
    private readonly analytics: AnalyticsService,
  ) {}

  @Get()
  overview(@Param('organizerSlug') slug: string) {
    return this.dashboard.organizerOverview(slug);
  }

  @Get('events/:eventSlug/orders')
  listEventOrders(
    @Param('organizerSlug') organizerSlug: string,
    @Param('eventSlug') eventSlug: string,
  ) {
    return this.dashboard.listEventOrders(organizerSlug, eventSlug);
  }

  // Aggregate analytics for the last N days (default 30, max 365).
  // OrganizerMemberGuard enforces membership so a non-member can't
  // even discover whether an organizer exists.
  @Get('analytics')
  analyticsForOrganizer(
    @Param('organizerSlug') slug: string,
    @Query('days') days?: string,
  ) {
    return this.analytics.forOrganizer(slug, days ? parseInt(days, 10) : undefined);
  }
}
