import { Module } from '@nestjs/common';
import { TicketsModule } from '../tickets/tickets.module';
import { DevelopersModule } from '../developers/developers.module';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [TicketsModule, DevelopersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
