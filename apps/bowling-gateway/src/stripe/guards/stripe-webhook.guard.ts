import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));

  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['stripe-signature'];
    const secret = this.config.get('STRIPE_WEBHOOK_SECRET');

    try {
      request.stripeEvent = this.stripe.webhooks.constructEvent(request.body, signature, secret);
      return true;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  }
}
