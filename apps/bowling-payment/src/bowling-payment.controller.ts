import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, RpcException, Payload } from '@nestjs/microservices';
import { BowlingPaymentService } from './bowling-payment.service';
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
    data: any,
    @CurrentUser() user: User,
  ): Promise<any> {
    const res = await this.bowlingPaymentService.createCheckoutSession(data);
    if (res.url) {
      // create order in db
      console.log('created user is', user);
      await this.bowlingPaymentService.createOrder(res.id, user.id);
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
