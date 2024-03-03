import { Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { AddProductDto } from './dto/addProductDto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
  ) { }

  async search(data: SearchProductDto, authentication: string) {
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

  async add(data: AddProductDto) {
    try {
      const product = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'add-product'
          },
          data,
        )
      )
      return product
    } catch (err) {
      console.log(`Error adding product: ${err}`)
    }
  }
}
