import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeWebhookGuard } from './guards/stripe-webhook.guard';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';
import { lastValueFrom } from 'rxjs';

@Controller('stripe')
export class StripeController {
  constructor(@Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy) {}

  @UseGuards(StripeWebhookGuard)
  @Post('/webhook')
  async handleStripWebhook(@Req() req) {
    const event = req.stripeEvent;
    console.log('webhook is called');
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
