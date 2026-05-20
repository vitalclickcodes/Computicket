import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyGuard } from './api-key.guard';

class CreateKeyDto {
  @IsString() @MinLength(1) name!: string;
}

@ApiTags('api-keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeys: ApiKeysService) {}

  @Post()
  create(@Param('organizerSlug') slug: string, @Body() dto: CreateKeyDto) {
    return this.apiKeys.create(slug, dto.name);
  }

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.apiKeys.list(slug);
  }

  @Delete(':id')
  revoke(@Param('organizerSlug') slug: string, @Param('id') id: string) {
    return this.apiKeys.revoke(slug, id);
  }
}

/**
 * Public API surface — authenticated by per-organizer API keys, not JWTs.
 * Phase 1 only exposes /me as a connectivity smoke test; full event/order
 * surface lands as it's adopted by partner integrations.
 */
@ApiTags('public-api')
@UseGuards(ApiKeyGuard)
@Controller('api/v1')
export class PublicApiController {
  @Get('me')
  me(@Req() req: Request) {
    return {
      organizer: req.apiKey!.organizer,
      apiKeyId: req.apiKey!.apiKeyId,
    };
  }
}
