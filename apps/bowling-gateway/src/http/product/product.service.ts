import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AddProductDto } from './dto/addProductDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared';

@Injectable()
export class ProductService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async get(id: string) {
    try {
      return await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-product-by-id',
          },
          id,
        ),
      );
    } catch (err) {
      throw new HttpException('Error fetching product', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Error fetching products', HttpStatus.NOT_FOUND);
    }
  }

  async checkout(data: any) {
    try {
      const products = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'get-products-by-ids',
          },
          data,
        ),
      );
      const productsWithQuantity = products.map((product) => {
        const quantity = data.products.find((p) => p.id === product.id).quantity;
        return {
          ...product,
          quantity,
        };
      });
      return await lastValueFrom(
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
      throw new HttpException('Error updating product', HttpStatus.BAD_REQUEST);
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
