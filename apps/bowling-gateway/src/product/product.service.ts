import { Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';
import { AddProductDto } from './dto/addProductDto';
import { UpdateProductDto } from './dto/updateProductDto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async get(id: string) {
    try {
      const product = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-product-by-id',
          },
          id,
        ),
      );
      return product;
    } catch (err) {
      console.error('Error getting product:', err);
      throw err;
    }
  }

  async search(data: SearchProductDto) {
    try {
      return await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'search-products',
          },
          data,
        ),
      );
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }

  async checkout(data: any) {
    try {
      // check if products are available
      const products = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-products-by-ids',
          },
          data,
        ),
      );
      console.log(products);
      const productsWithQuantity = products.map((product) => {
        const quantity = data.products.find((p) => p.id === product.id).quantity;
        return {
          ...product,
          quantity,
        };
      });
      const res = await lastValueFrom(
        this.paymentClient.send(
          {
            cmd: 'create-checkout-session',
          },
          {
            products: productsWithQuantity,
            user: data.user,
          },
        ),
      );

      return res;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    }
  }
  async add(data: AddProductDto) {
    return await lastValueFrom(
      this.mainClient.send(
        {
          cmd: 'add-product',
        },
        data,
      ),
    );
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      return await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'update-product',
          },
          {
            ...data,
            id,
          },
        ),
      );
    } catch (err) {
      console.log(`Error updateing product: ${err}`);
    }
  }

  async deleteProduct(id: string) {
    try {
      return await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'delete-product',
          },
          {
            id,
          },
        ),
      );
    } catch (err) {
      console.log(`Error deleting product: ${err}`);
    }
  }
}
