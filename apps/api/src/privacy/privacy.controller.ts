import { Body, Controller, Delete, Get, Ip, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrivacyService } from './privacy.service';

class DeleteAccountDto {
  @IsString() password!: string;
}

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class PrivacyController {
  constructor(private readonly privacy: PrivacyService) {}

  @Get('data-export')
  export(@Req() req: Request) {
    return this.privacy.export(req.user!.id);
  }

  @Delete('account')
  deleteAccount(@Req() req: Request, @Body() dto: DeleteAccountDto, @Ip() ip: string) {
    return this.privacy.deleteAccount(req.user!.id, dto.password, ip);
  }
}
