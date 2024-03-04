import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { orders, transactions } from '@app/shared/database/schemas/schemas';
import { eq } from 'drizzle-orm';

export interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
@Injectable()
export class BowlingPaymentService {
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));

  constructor(
    private readonly config: ConfigService,
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase,
  ) {}

  async createCheckoutSession(products: CheckoutProduct[]) {
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

  async createTransaction(id: string, userId: string, orderId: string) {
    // create order in db
    await this.db.insert(transactions).values({
      orderId,
      userId,
      status: 'pending',
      stripeCheckoutSessionId: id,
    });
  }

  async handleStripeWebhook(event: any) {
    console.log('event', event);
    if (event.type === 'checkout.session.completed') {
      await this.db.update(transactions).set({ status: 'completed' }).where(eq(transactions.stripeCheckoutSessionId, event.data.object.id));
    }
    if (event.type === 'checkout.session.expired') {
      await this.db.update(transactions).set({ status: 'expired' }).where(eq(transactions.stripeCheckoutSessionId, event.data.object.id));
    }
    return;
  }
}
