import { Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';
import { AddProductDto } from './dto/addProductDto';
import { CreateCheckoutDto } from './dto/createCheckoutDto';

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
            cmd: 'search-products',
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

  async checkout(data: CreateCheckoutDto) {
    try {
      // check if products are available
      const products = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-products-by-ids',
          },
          data.products,
        ),
      );
      console.log('products', products);
      const res = await lastValueFrom(
        this.paymentClient.send(
          {
            cmd: 'create-checkout-session',
          },
          products,
        ),
      );

      return res;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }
  async add(data: AddProductDto) {
    try {
      const product = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'add-product',
          },
          data,
        ),
      );
      return product;
    } catch (err) {
      console.log(`Error adding product: ${err}`);
    }
  }

  async update(oldName: string, data: AddProductDto) {
    try {
      const product = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'update-product',
          },
          {
            ...data,
            oldName,
          },
        ),
      );
      return product;
    } catch (err) {
      console.log(`Error updateing product: ${err}`);
    }
  }

  async deleteProduct(name: string) {
    try {
      const product = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'delete-product',
          },
          {
            name,
          },
        ),
      );
      return product;
    } catch (err) {
      console.log(`Error deleting product: ${err}`);
    }
  }
}
