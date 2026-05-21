import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AccountSecurityController, AuthSecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  imports: [AuthModule],
  controllers: [AuthSecurityController, AccountSecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
