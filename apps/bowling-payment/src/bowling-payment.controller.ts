import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, RpcException, Payload } from '@nestjs/microservices';

import { BowlingPaymentService } from './bowling-payment.service';
import { JwtAuthGuard } from '@app/shared';

@Controller()
export class BowlingPaymentController {
  constructor(private readonly bowlingPaymentService: BowlingPaymentService) {}

  @MessagePattern({
    cmd: 'create-checkout-session',
  })
  async create(
    @Payload()
    data: {
      orderId: string;
      amountToPay: number;
    },
  ): Promise<any> {
    const res = await this.bowlingPaymentService.createCheckoutSession(data);
    console.log('res', res.url);
    if (res.url) {
      // create order in db
      return res;
    }
    throw new RpcException({
      message: 'Error creating session',
      code: 500,
    });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({
    cmd: 'stripe-webhook',
  })
  async handleStripeWebhook(event: any) {
    return await this.bowlingPaymentService.handleStripeWebhook(event);
  }
}
