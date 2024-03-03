import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(private readonly config: ConfigService) {}
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));
}
