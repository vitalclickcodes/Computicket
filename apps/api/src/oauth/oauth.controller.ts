import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() redirect_uri?: string;
}

class GrantDto {
  @IsString() client_id!: string;
  @IsString() redirect_uri!: string;
  @IsString() scope!: string;
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

@ApiTags('oauth')
@Controller('oauth')
export class OAuthTokenController {
  constructor(private readonly oauth: OAuthService) {}

  /**
   * Step 1 of the authorization_code flow. The client redirects the
   * user to this endpoint; the front-end consent page calls it to
   * surface the client/scope info before asking the user to approve.
   */
  @Get('authorize')
  describe(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('scope') scope: string,
  ) {
    if (!clientId || !redirectUri || !scope) {
      throw new BadRequestException('client_id, redirect_uri, scope are required');
    }
    return this.oauth.describeAuthorizationRequest({
      clientId,
      redirectUri,
      scopes: scope.split(/\s+/).filter(Boolean),
    });
  }

  /**
   * Step 2: the user approves. Authenticated via JWT (existing buyer or
   * organizer login). Returns the code; the consent page redirects the
   * browser to redirect_uri with ?code=... appended.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('authorize/grant')
  grant(@Body() dto: GrantDto, @Req() req: Request) {
    return this.oauth.issueAuthorizationCode({
      clientId: dto.client_id,
      userId: req.user!.id,
      redirectUri: dto.redirect_uri,
      scopes: dto.scope.split(/\s+/).filter(Boolean),
    });
  }

  @Post('token')
  token(@Body() dto: TokenRequestDto) {
    if (dto.grant_type === 'client_credentials') {
      return this.oauth.issueToken({
        clientId: dto.client_id,
        clientSecret: dto.client_secret,
        scope: dto.scope,
      });
    }
    if (dto.grant_type === 'authorization_code') {
      if (!dto.code || !dto.redirect_uri) {
        throw new BadRequestException('code and redirect_uri are required for authorization_code');
      }
      return this.oauth.exchangeCode({
        clientId: dto.client_id,
        clientSecret: dto.client_secret,
        code: dto.code,
        redirectUri: dto.redirect_uri,
      });
    }
    throw new BadRequestException(
      "Unsupported grant_type; expected 'client_credentials' or 'authorization_code'",
    );
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
