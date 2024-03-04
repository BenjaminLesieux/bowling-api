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
    data: { orderId: string; amountToPay: number },
    @CurrentUser() user: User,
  ): Promise<any> {
    // first we should check if transaction is not already pending
    const transaction = await this.bowlingPaymentService.getPendingTransaction(data.orderId);
    // manage the concurrency between the payment sessions.
    if (transaction) {
      throw new RpcException({
        message: 'Transaction already pending',
        code: 400,
      });
    }
    const res = await this.bowlingPaymentService.createCheckoutSession(data);
    if (res.url) {
      // create order in db
      await this.bowlingPaymentService.createTransaction(res.id, user.id, data.orderId, data.amountToPay);
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
