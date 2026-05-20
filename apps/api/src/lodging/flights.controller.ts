import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { FlightsService } from './flights.service';

class CreateFlightDto {
  @IsString() flightNumber!: string;
  @IsString() airline!: string;
  @IsString() fromAirport!: string;
  @IsString() toAirport!: string;
  @IsDateString() departsAt!: string;
  @IsDateString() arrivesAt!: string;
  @IsInt() @Min(0) priceKobo!: number;
  @IsInt() @Min(1) capacity!: number;
}

@ApiTags('flights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/flights')
export class FlightsController {
  constructor(private readonly flights: FlightsService) {}

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.flights.listForOrganizer(slug);
  }

  @Post()
  create(@Param('organizerSlug') slug: string, @Body() dto: CreateFlightDto) {
    return this.flights.create(slug, dto);
  }
}

@ApiTags('flights')
@Controller('flights')
export class PublicFlightsController {
  constructor(private readonly flights: FlightsService) {}

  @Get()
  search(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
  ) {
    return this.flights.search({ from, to, date });
  }
}
