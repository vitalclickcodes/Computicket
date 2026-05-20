import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BusRoutesController, BusSearchController } from './buses.controller';
import { BusesService } from './buses.service';

@Module({
  imports: [AuthModule],
  controllers: [BusRoutesController, BusSearchController],
  providers: [BusesService],
})
export class BusesModule {}
