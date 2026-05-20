import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { SeatingService } from './seating.service';

class SeatRowDto {
  @IsString() @MinLength(1) row!: string;
  @IsArray() @ArrayMinSize(1) @IsString({ each: true }) seats!: string[];
}

class SetSeatMapDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => SeatRowDto)
  rows!: SeatRowDto[];
}

@ApiTags('seating')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/ticket-types/:ticketTypeId/seat-map')
export class SeatingController {
  constructor(private readonly seating: SeatingService) {}

  @Post()
  set(@Param('ticketTypeId') id: string, @Body() dto: SetSeatMapDto) {
    return this.seating.setSeatMap(id, dto.rows);
  }
}

@ApiTags('seats')
@Controller('ticket-types/:ticketTypeId/seats')
export class PublicSeatsController {
  constructor(private readonly seating: SeatingService) {}

  @Get()
  list(@Param('ticketTypeId') id: string) {
    return this.seating.listSeatsForTicketType(id);
  }
}
