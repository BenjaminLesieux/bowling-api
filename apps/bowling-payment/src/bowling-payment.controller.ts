import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, RpcException, Payload } from '@nestjs/microservices';
import { BowlingPaymentService, CheckoutProduct } from './bowling-payment.service';
import { CurrentUser } from 'apps/bowling-auth/src/current-user.decorator';
import { User } from '@app/shared/database/schemas/schemas';
import { JwtAuthGuard } from '@app/shared';

@Controller()
export class BowlingPaymentController {
  constructor(private readonly bowlingPaymentService: BowlingPaymentService) {}

  @UseGuards(JwtAuthGuard)
  @MessagePattern({
    cmd: 'create-checkout-session',
  })
  async create(
    @Payload()
    data: { orderId: string; products: CheckoutProduct[] },
    @CurrentUser() user: User,
  ): Promise<any> {
    const res = await this.bowlingPaymentService.createCheckoutSession(data.products);
    if (res.url) {
      // create order in db
      console.log('created user is', user);
      await this.bowlingPaymentService.createTransaction(res.id, user.id, data.orderId);
      return res.url;
    }
    throw new RpcException({
      message: 'Error creating checkout session',
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
