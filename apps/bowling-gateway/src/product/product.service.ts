import { Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';

@Injectable()
export class ProductService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async search(data: SearchProductDto) {
    try {
      const products = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-products',
          },
          data,
        ),
      );

      console.log('products', products);

      return products;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }

  async checkout(data: any) {
    try {
      const res = await lastValueFrom(
        this.paymentClient.send(
          {
            cmd: 'create-checkout-session',
          },
          data,
        ),
      );

      console.log('checkout is', res);

      return res;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }
}
