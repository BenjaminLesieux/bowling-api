import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';

@Module({
  imports: [],
  controllers: [BowlingMainController],
  providers: [BowlingMainService],
})
export class BowlingMainModule {}
