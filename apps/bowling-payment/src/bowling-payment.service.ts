import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared';

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
    @Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy,
  ) {}

  async createCheckoutSession(products: CheckoutProduct[]) {
    return await this.stripe.checkout.sessions.create({
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
  }

  async create(data: CheckoutProduct[], user: any) {
    const res = await this.createCheckoutSession(data);
    if (res.url) {
      const order = await lastValueFrom(
        this.client.emit(
          {
            cmd: 'on-session-create',
          },
          { id: res.id, userId: user.id },
        ),
      );
      return {
        url: res.url,
        order,
      };
    }
    throw new RpcException({
      message: 'Error creating checkout session',
      code: 500,
    });
  }

  async handleStripeWebhook(event: any) {
    console.log('event', event);
    if (event.type === 'checkout.session.completed') {
      // await this.db.update(orders).set({ status: 'completed' }).where(eq(orders.stripeCheckoutSessionId, event.data.object.id));
    }
    if (event.type === 'checkout.session.expired') {
      // await this.db.update(orders).set({ status: 'expired' }).where(eq(orders.stripeCheckoutSessionId, event.data.object.id));
    }
    return;
  }
}
