import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NftService } from './nft.service';

class ClaimNftDto {
  @IsString() wallet!: string;
}

@ApiTags('nft')
@Controller('tickets')
export class NftController {
  constructor(private readonly nft: NftService) {}

  // Public — OpenSea-style metadata. The QR remains the actual entry
  // credential; this just makes the ticket displayable as a collectible.
  @Get(':code/metadata.json')
  metadata(@Param('code') code: string) {
    return this.nft.metadata(code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':code/collectible')
  status(@Req() req: Request, @Param('code') code: string) {
    return this.nft.status(req.user!.id, code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':code/claim-nft')
  claim(@Req() req: Request, @Param('code') code: string, @Body() dto: ClaimNftDto) {
    return this.nft.claim(req.user!.id, code, dto.wallet);
  }
}
