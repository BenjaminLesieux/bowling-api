import { Inject, Injectable } from '@nestjs/common';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateParkDto,
  SearchParkDto,
  UpdateParkDto,
} from './dto/bowling-parks.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BowlingParksService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy,
  ) {}

  async createPark(data: CreateParkDto) {
    return await lastValueFrom(
      this.client.send({ cmd: 'create-bowling-park' }, data),
    );
  }

  async getBowlingParks() {
    return await lastValueFrom(
      this.client.send({ cmd: 'get-bowling-parks' }, {}),
    );
  }

  async getBowlingParkBy(search: SearchParkDto) {
    return await lastValueFrom(
      this.client.send({ cmd: 'get-bowling-park-by' }, search),
    );
  }

  async updateBowlingPark(id: string, data: UpdateParkDto) {
    return await lastValueFrom(
      this.client.send({ cmd: 'update-bowling-park' }, { id, ...data }),
    );
  }

  async deleteBowlingPark(id: string) {
    return await lastValueFrom(
      this.client.send({ cmd: 'delete-bowling-park' }, id),
    );
  }
}
