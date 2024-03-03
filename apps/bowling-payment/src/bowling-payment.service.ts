import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
@Injectable()
export class BowlingPaymentService {
  constructor(private readonly config: ConfigService) {}
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));

  getHello(): string {
    return 'Hello World!';
  }

  async createCheckoutSession(products: any[]) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    return session;
  }
}
