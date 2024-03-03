import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { BowlingPaymentService } from './bowling-payment.service';
import { CurrentUser } from 'apps/bowling-auth/src/current-user.decorator';
import { User } from '@app/shared/database/schemas/schemas';

@Controller()
export class BowlingPaymentController {
  constructor(private readonly bowlingPaymentService: BowlingPaymentService) {}

  @MessagePattern({
    cmd: 'create-checkout-session',
  })
  async create(@CurrentUser() user: User): Promise<any> {
    const products = [
      {
        id: 1,
        name: 'Bowling Ball',
        price: 100,
        quantity: 2,
      },
      {
        id: 2,
        name: 'Bowling Shoes',
        price: 50,
        quantity: 3,
      },
      {
        id: 3,
        name: 'Bowling Pins',
        price: 10,
        quantity: 4,
      },
    ];
    const res = await this.bowlingPaymentService.createCheckoutSession(products);
    if (res.url) {
      // create order in db
      await this.bowlingPaymentService.createOrder(res.id, user.id);
      return res.url;
    }
    throw new RpcException({
      message: 'Error creating checkout session',
      code: 500,
    });
  }

  @MessagePattern({
    cmd: 'stripe-webhook',
  })
  async handleStripeWebhook(event: any) {
    return await this.bowlingPaymentService.handleStripeWebhook(event);
  }
}
