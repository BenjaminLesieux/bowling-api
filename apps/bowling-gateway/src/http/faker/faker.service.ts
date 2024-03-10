import { User } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { MAIN_MICROSERVICE } from '@app/shared';
import FakerCommands from '@app/shared/infrastructure/transport/commands/FakerCommands';

@Injectable()
export class FakerService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy) {}
  async init(data: User) {
    console.log(data);
    console.log('init gateway');
    return await lastValueFrom(this.mainClient.send(FakerCommands.INIT_FAKER, data));
  }
}
