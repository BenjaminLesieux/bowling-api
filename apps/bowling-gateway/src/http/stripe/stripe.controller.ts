import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { StripeWebhookGuard } from '../../util/guards/stripe-webhook.guard';
import { PAYMENT_MICROSERVICE } from '@app/shared';

@Controller('stripe')
export class StripeController {
  constructor(@Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy) {}

  @UseGuards(StripeWebhookGuard)
  @Post('/webhook')
  async handleStripWebhook(@Req() req) {
    const event = req.stripeEvent;
    return await lastValueFrom(
      this.paymentClient.send(
        {
          cmd: 'stripe-webhook',
        },
        { ...event },
      ),
    );
  }
}
