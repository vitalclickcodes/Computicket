import { Body, Controller, Get, Header, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { Request, Response } from 'express';
import * as QRCode from 'qrcode';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketsService } from './tickets.service';

class ScanDto {
  @IsString() code!: string;
}

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.tickets.findByCode(code);
  }

  @Get(':code/qr.png')
  @Header('content-type', 'image/png')
  @Header('cache-control', 'private, max-age=3600')
  async qr(@Param('code') code: string, @Res() res: Response) {
    await this.tickets.findByCode(code);
    const png = await QRCode.toBuffer(code, { errorCorrectionLevel: 'M', width: 320, margin: 1 });
    res.send(png);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('scan')
  scan(@Body() dto: ScanDto, @Req() req: Request) {
    return this.tickets.scan(dto.code, req.user!.id);
  }
}
