import { MAIN_MICROSERVICE } from '@app/shared/services';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddSessionDto } from './dto/addSessionDto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SessionService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy) {}

  async add(data: AddSessionDto) {
    try {
      const sesssion = await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'add-session',
          },
          data,
        ),
      );
      return sesssion;
    } catch (err) {
      console.log('Error adding session gateway', data, err);
      throw err;
    }
  }
}
