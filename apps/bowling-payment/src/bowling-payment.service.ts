import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_...');

@Injectable()
export class BowlingPaymentService {
  getHello(): string {
    return 'Hello World!';
  }

  async createCheckoutSession(products: any[]) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [product.image],
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
