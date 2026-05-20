import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizerMemberGuard } from '../auth/organizer-member.guard';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './oauth.guard';

class RegisterClientDto {
  @IsString() @MinLength(1) name!: string;
  @IsArray() @ArrayMinSize(1) @IsString({ each: true }) scopes!: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) redirectUris?: string[];
}

class TokenRequestDto {
  @IsString() grant_type!: string;
  @IsString() client_id!: string;
  @IsString() client_secret!: string;
  @IsOptional() @IsString() scope?: string;
}

@ApiTags('oauth-clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizerMemberGuard)
@Controller('dashboard/organizers/:organizerSlug/oauth-clients')
export class OAuthClientsController {
  constructor(private readonly oauth: OAuthService) {}

  @Get()
  list(@Param('organizerSlug') slug: string) {
    return this.oauth.listClients(slug);
  }

  @Post()
  register(@Param('organizerSlug') slug: string, @Body() dto: RegisterClientDto) {
    return this.oauth.registerClient(slug, dto);
  }

  @Delete(':id')
  revoke(@Param('organizerSlug') slug: string, @Param('id') id: string) {
    return this.oauth.revokeClient(slug, id);
  }
}

@ApiTags('oauth-token')
@Controller('oauth')
export class OAuthTokenController {
  constructor(private readonly oauth: OAuthService) {}

  @Post('token')
  token(@Body() dto: TokenRequestDto) {
    if (dto.grant_type !== 'client_credentials') {
      throw new Error('Only grant_type=client_credentials is supported');
    }
    return this.oauth.issueToken({
      clientId: dto.client_id,
      clientSecret: dto.client_secret,
      scope: dto.scope,
    });
  }
}

@ApiTags('oauth-resource')
@ApiBearerAuth()
@UseGuards(OAuthGuard)
@Controller('oauth/v1')
export class OAuthMeController {
  @Get('me')
  me(@Req() req: Request) {
    return req.oauth;
  }
}
