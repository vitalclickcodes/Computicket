import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { BusesService } from './buses.service';

class CreateRouteDto {
  @IsString() @MinLength(2) fromCity!: string;
  @IsString() @MinLength(2) toCity!: string;
  @IsInt() durationMinutes!: number;
}

@ApiTags('bus-routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/bus-routes')
export class BusRoutesController {
  constructor(private readonly buses: BusesService) {}

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.buses.listOrganizerRoutes(slug);
  }

  @Post()
  create(@Param('organizerSlug') slug: string, @Body() dto: CreateRouteDto) {
    return this.buses.createRoute(slug, dto);
  }

  @Delete(':id')
  deactivate(@Param('organizerSlug') slug: string, @Param('id') id: string) {
    return this.buses.deactivateRoute(slug, id);
  }
}

@ApiTags('buses')
@Controller('buses')
export class BusSearchController {
  constructor(private readonly buses: BusesService) {}

  @Get()
  search(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
  ) {
    return this.buses.searchTrips({ from, to, date });
  }

  @Get('cities')
  cities() {
    return this.buses.listCities();
  }
}
