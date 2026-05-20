import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SeatingController, PublicSeatsController } from './seating.controller';
import { SeatingService } from './seating.service';

@Module({
  imports: [AuthModule],
  controllers: [SeatingController, PublicSeatsController],
  providers: [SeatingService],
  exports: [SeatingService],
})
export class SeatingModule {}
