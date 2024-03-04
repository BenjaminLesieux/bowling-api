import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';
import { CreateCheckoutDto } from './dto/createCheckoutDto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async checkout(data: CreateCheckoutDto) {
    try {
      // check if products are available
      const res = await lastValueFrom(
        this.paymentClient.send(
          {
            cmd: 'create-checkout-session',
          },
          data,
        ),
      );

      return res;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }
}
