import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException, Payload } from '@nestjs/microservices';

import { BowlingPaymentService } from './bowling-payment.service';
import StripeCommands from '@app/shared/infrastructure/transport/commands/StripeCommands';

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
    if (res.url) {
      // create order in db
      return res;
    }
    throw new RpcException({
      message: 'Error creating session',
      code: 500,
    });
  }

  @MessagePattern(StripeCommands.STRIPE_WEKBHOOK)
  async handleStripeWebhook(event: any) {
    return await this.bowlingPaymentService.handleStripeWebhook(event);
  }
}
