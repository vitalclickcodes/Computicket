import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/sessions')
export class SessionsController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  list(@Req() req: Request) {
    return this.auth.listSessions(req.user!.id, req.user!.sessionId);
  }

  // Revoke every session except the one making the request — the usual
  // "log out everywhere" button.
  @Delete()
  revokeAllButCurrent(@Req() req: Request) {
    return this.auth.revokeAllSessions(req.user!.id, req.user!.sessionId);
  }

  @Delete(':id')
  revokeOne(@Req() req: Request, @Param('id') id: string) {
    return this.auth.revokeSession(req.user!.id, id);
  }
}
