import { Inject, Injectable } from '@nestjs/common';
import { SearchOrderDto } from './dto/search-order.dto';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

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
}
