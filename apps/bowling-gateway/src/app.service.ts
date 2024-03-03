import { Inject, Injectable } from '@nestjs/common';
import { MAIN_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy,
  ) {}

  async getHello() {
    return await lastValueFrom<string>(this.client.send({ cmd: 'hello' }, ''));
  }
}
