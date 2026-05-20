import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { PromoCodeType } from '@computicket/db';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { PromoCodesService } from './promo-codes.service';

class CreatePromoDto {
  @IsString() @Matches(/^[A-Za-z0-9-]{2,32}$/) code!: string;
  @IsEnum(PromoCodeType) type!: PromoCodeType;
  @IsInt() @Min(1) value!: number;
  @IsOptional() @IsString() eventSlug?: string;
  @IsOptional() @IsInt() @Min(1) maxUses?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
}

@ApiTags('promo-codes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/promo-codes')
export class PromoCodesController {
  constructor(private readonly promos: PromoCodesService) {}

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.promos.list(slug);
  }

  @Post()
  create(@Param('organizerSlug') slug: string, @Body() dto: CreatePromoDto) {
    return this.promos.create({ ...dto, organizerSlug: slug });
  }

  @Delete(':id')
  deactivate(@Param('organizerSlug') slug: string, @Param('id') id: string) {
    return this.promos.deactivate(slug, id);
  }
}
