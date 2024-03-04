import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alleys.dto';

@Injectable()
export class BowlingAlleysService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy,
  ) {}

  async deleteBowlingAlley(id: string) {
    return await lastValueFrom(
      this.client.send({ cmd: 'delete-bowling-alley' }, id),
    );
  }

  async createAlley(data: CreateAlleyDto) {
    return await lastValueFrom(
      this.client.send({ cmd: 'add-bowling-alley' }, data),
    );
  }

  async getBowlingAlleyBy(search: SearchAlleyDto) {
    return await lastValueFrom(
      this.client.send({ cmd: 'get-bowling-alley-by' }, search),
    );
  }

  async getBowlingAlleys() {
    return await lastValueFrom(
      this.client.send({ cmd: 'get-bowling-alleys' }, {}),
    );
  }
}
