import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeysService } from './api-keys.service';

declare module 'express' {
  interface Request {
    apiKey?: {
      apiKeyId: string;
      organizer: { id: string; slug: string; name: string; status: string };
    };
  }
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeys: ApiKeysService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing API key');
    }
    const raw = header.slice('Bearer '.length).trim();
    const resolved = await this.apiKeys.resolve(raw);
    if (!resolved) throw new UnauthorizedException('Invalid or revoked API key');
    req.apiKey = resolved;
    return true;
  }
}
