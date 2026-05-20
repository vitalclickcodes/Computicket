import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SeatingModule } from '../seating/seating.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [AuthModule, SeatingModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
