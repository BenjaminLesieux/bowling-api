import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeWebhookGuard } from '../../infrastructure/util/guards/stripe-webhook.guard';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(StripeWebhookGuard)
  @Post('/webhook')
  async handleStripeWebhook(@Req() req) {
    const event = req.stripeEvent;
    return this.stripeService.handleStripeWebhook(event);
  }
}
