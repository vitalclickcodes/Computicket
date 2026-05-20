import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OAuthClientsController, OAuthTokenController, OAuthMeController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './oauth.guard';

@Module({
  imports: [AuthModule],
  controllers: [OAuthClientsController, OAuthTokenController, OAuthMeController],
  providers: [OAuthService, OAuthGuard],
  exports: [OAuthService, OAuthGuard],
})
export class OAuthModule {}
