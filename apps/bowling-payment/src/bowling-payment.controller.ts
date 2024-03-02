import { Controller, Get } from '@nestjs/common';
import { BowlingPaymentService } from './bowling-payment.service';

@Controller()
export class BowlingPaymentController {
  constructor(private readonly bowlingPaymentService: BowlingPaymentService) {}

  @Get()
  getHello(): string {
    return this.bowlingPaymentService.getHello();
  }
}
