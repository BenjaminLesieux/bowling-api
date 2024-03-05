import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { BowlingPaymentService, CheckoutProduct } from './bowling-payment.service';
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
      products: CheckoutProduct[];
      user: any;
    },
  ): Promise<any> {
    console.log(data);
    if (!data.user) {
      throw new RpcException('Unauthorized');
    }
    return await this.bowlingPaymentService.create(data.products, data.user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({
    cmd: 'stripe-webhook',
  })
  async handleStripeWebhook(event: any) {
    return await this.bowlingPaymentService.handleStripeWebhook(event);
  }
}
