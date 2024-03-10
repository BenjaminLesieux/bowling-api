import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import schemas from '@app/shared/database/schemas/schemas';
import { MAIN_MICROSERVICE } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import OrderCommands from '@app/shared/infrastructure/transport/commands/OrderCommands';

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
    @Inject(MAIN_MICROSERVICE) private readonly mainMicroservice: ClientProxy,
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
      return await lastValueFrom(this.mainMicroservice.send(OrderCommands.UPDATE_ON_CHECKOUT_COMPLETE, { ...event }));
    }
    if (event.type === 'checkout.session.expired') {
      return await lastValueFrom(this.mainMicroservice.send(OrderCommands.UPDATE_ON_CHECKOUT_EXPIRED, { ...event }));
    }
  }
}
