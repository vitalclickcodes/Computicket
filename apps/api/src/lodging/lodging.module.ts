import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HotelsController, PublicHotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { FlightsController, PublicFlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

@Module({
  imports: [AuthModule],
  controllers: [
    HotelsController,
    PublicHotelsController,
    FlightsController,
    PublicFlightsController,
  ],
  providers: [HotelsService, FlightsService],
})
export class LodgingModule {}
