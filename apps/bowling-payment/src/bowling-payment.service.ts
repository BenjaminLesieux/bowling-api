import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import schemas, { orders, transactions } from '@app/shared/database/schemas/schemas';
import { and, eq, sql } from 'drizzle-orm';
import { takeUniqueOrThrow } from 'apps/bowling-main/src/database/helpers';
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
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
  ) {}

  async createCheckoutSession(data: { orderId: string; amountToPay: number }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Paiement pour ' + data.orderId,
            },
            unit_amount: data.amountToPay,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    return session;
  }

  async handleStripeWebhook(event: Stripe.CheckoutSessionCompletedEvent) {
    if (event.type === 'checkout.session.completed') {
      // update transaction status to completed
      await this.db.update(transactions).set({ status: 'completed' }).where(eq(transactions.stripeCheckoutSessionId, event.data.object.id));

      const order = await this.db.select().from(schemas.orders).where(eq(transactions.stripeCheckoutSessionId, event.data.object.id)).then(takeUniqueOrThrow);
      if (!order) throw new Error('Order not found');
      //update order paidAmount
      return await this.db
        .update(orders)
        .set({ payedAmount: sql`${orders.payedAmount} + ${event.data.object.amount_total}` })
        .where(eq(orders.id, order.id));
    }
    if (event.type === 'checkout.session.expired') {
      return await this.db.update(transactions).set({ status: 'expired' }).where(eq(transactions.stripeCheckoutSessionId, event.data.object.id));
    }
  }
}
