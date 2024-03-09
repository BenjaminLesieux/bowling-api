import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { lastValueFrom } from 'rxjs';
import { PAYMENT_MICROSERVICE } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import StripeCommands from '@app/shared/infrastructure/transport/commands/StripeCommands';

@Injectable()
export class StripeService {
  stripe = new Stripe(this.config.get('STRIPE_SK_KEY'));

  constructor(
    private readonly config: ConfigService,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async handleStripeWebhook(event: Stripe.Event) {
    await lastValueFrom(this.paymentClient.send(StripeCommands.STRIPE_WEKBHOOK, { ...event }));
  }
}
