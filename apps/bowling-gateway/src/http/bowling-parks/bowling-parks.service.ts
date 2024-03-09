import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddProductToCatalogDto, CreateParkDto, SearchParkDto, UpdateParkDto } from './dto/bowling-parks.dto';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared';
import BowlingParkCommands from '@app/shared/infrastructure/transport/commands/BowlingParkCommands';

@Injectable()
export class BowlingParksService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy) {}

  async createPark(data: CreateParkDto) {
    return await lastValueFrom(this.client.send(BowlingParkCommands.CREATE_BOWLING_PARK, data));
  }

  async getBowlingParks() {
    return await lastValueFrom(this.client.send({ cmd: 'get-bowling-parks' }, {}));
  }

  async getBowlingParkBy(search: SearchParkDto) {
    return await lastValueFrom(this.client.send({ cmd: 'get-bowling-park-by' }, search));
  }

  async updateBowlingPark(id: string, data: UpdateParkDto) {
    return await lastValueFrom(this.client.send({ cmd: 'update-bowling-park' }, { id, ...data }));
  }

  async deleteBowlingPark(id: string) {
    return await lastValueFrom(this.client.send({ cmd: 'delete-bowling-park' }, id));
  }

  async getProductsByBowlingPark(id: string) {
    return await lastValueFrom(this.client.send(BowlingParkCommands.GET_PRODUCTS_BY_BOWLING_PARK, { id }));
  }

  async addProductToCatalog(id: string, data: AddProductToCatalogDto) {
    return await lastValueFrom(this.client.send(BowlingParkCommands.ADD_PRODUCT_TO_CATALOG, { id, ...data }));
  }
}
