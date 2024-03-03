import { Inject, Injectable } from '@nestjs/common';
import { SearchProductDto } from './dto/searchProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared/services';

@Injectable()
export class ProductService {
  constructor(@Inject(MAIN_MICROSERVICE) private mainClient: ClientProxy) {}

  async search(data: SearchProductDto, authentication: string) {
    try {
      const products = await lastValueFrom(
        this.mainClient.send('get-products', {
          data,
          Authentication: authentication,
        }),
      );

      console.log('products', products);

      return products;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  }
}
