import { Module } from '@nestjs/common';
import { BowlingPaymentController } from './bowling-payment.controller';
import { BowlingPaymentService } from './bowling-payment.service';

@Module({
  imports: [],
  controllers: [BowlingPaymentController],
  providers: [BowlingPaymentService],
})
export class BowlingPaymentModule {}
