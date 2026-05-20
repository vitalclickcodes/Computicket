import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { OAuthService } from './oauth.service';

declare module 'express' {
  interface Request {
    oauth?: {
      client: { id: string; name: string; clientId: string };
      organizer: { id: string; slug: string; name: string };
      scopes: string[];
    };
  }
}

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(private readonly oauth: OAuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Missing access token');
    const token = header.slice(7).trim();
    const result = await this.oauth.verifyToken(token);
    if (!result) throw new UnauthorizedException('Invalid or expired access token');
    req.oauth = result;
    return true;
  }
}
