import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BowlingPaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {}

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }
}
