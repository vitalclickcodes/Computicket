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
import { ArrayMinSize, IsArray, IsIn, IsString, IsUrl } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import {
  SUPPORTED_EVENT_TYPES,
  WebhookEndpointsService,
} from './webhook-endpoints.service';

class CreateEndpointDto {
  @IsUrl({ require_tld: false, require_protocol: true }) url!: string;
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsIn(SUPPORTED_EVENT_TYPES as unknown as string[], { each: true })
  eventTypes!: string[];
}

@ApiTags('webhook-endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/webhook-endpoints')
export class WebhookEndpointsController {
  constructor(private readonly endpoints: WebhookEndpointsService) {}

  @Post()
  create(@Param('organizerSlug') slug: string, @Body() dto: CreateEndpointDto) {
    return this.endpoints.create(slug, dto);
  }

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.endpoints.list(slug);
  }

  @Delete(':id')
  remove(@Param('organizerSlug') slug: string, @Param('id') id: string) {
    return this.endpoints.remove(slug, id);
  }
}
