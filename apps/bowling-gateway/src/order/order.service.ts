import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { CreateCheckoutDto } from './dto/createCheckoutDto';

import { AddProductDto } from './dto/addProductDto';
import { User } from '@app/shared/database/schemas/schemas';

@Injectable()
export class OrderService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy) {}

  async checkout(data: CreateCheckoutDto, checkoutUser: User) {
    try {
      // check if products are available
      const res = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'checkout',
          },
          { ...data, userId: checkoutUser.id },
        ),
      );

      return res;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }

  async addProduct(productData: AddProductDto, fromUser: User) {
    try {
      const data = { ...productData, userId: fromUser.id };
      const res = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'add-product-to-order',
          },
          data,
        ),
      );

      return res;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  }
}
