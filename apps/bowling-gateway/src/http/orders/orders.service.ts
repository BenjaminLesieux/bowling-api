import { Inject, Injectable } from '@nestjs/common';
import { SearchOrderDto } from './dto/search-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared';
import { CreateCheckoutDto } from './dto/createCheckoutDto';
import { User } from '@app/shared/adapters/user.type';
import { AddProductDto } from './dto/addProductDto';

@Injectable()
export class OrdersService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy) {}

  async getBy(data: SearchOrderDto) {
    return await lastValueFrom(
      this.client.send(
        {
          cmd: 'get-orders',
        },
        data,
      ),
    );
  }

  async checkout(data: CreateCheckoutDto, checkoutUser: User) {
    try {
      // check if products are available
      const res = await lastValueFrom(
        this.client.send(
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
        this.client.send(
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
