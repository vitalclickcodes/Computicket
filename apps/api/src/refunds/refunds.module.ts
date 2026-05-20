import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DevelopersModule } from '../developers/developers.module';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';

@Module({
  imports: [AuthModule, DevelopersModule],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
