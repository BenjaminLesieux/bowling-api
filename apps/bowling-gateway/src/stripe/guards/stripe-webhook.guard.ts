import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('??');
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['stripe-signature'];
    const secret = this.config.get('STRIPE_WEBHOOK_SECRET');

    try {
      const event = this.stripe.webhooks.constructEvent(request.body, signature, secret);
      request.stripeEvent = event;
      return true;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  }
}
