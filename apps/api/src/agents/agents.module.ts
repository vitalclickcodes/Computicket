import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AgentsController, AgentAdminController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  imports: [AuthModule],
  controllers: [AgentsController, AgentAdminController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
