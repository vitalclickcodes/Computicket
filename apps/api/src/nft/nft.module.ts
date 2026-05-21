import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [AuthModule],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
