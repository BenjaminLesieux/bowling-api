import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddSessionDto } from './dto/add-session.dto';
import { lastValueFrom } from 'rxjs';
import { MAIN_MICROSERVICE } from '@app/shared';
import SessionCommands from '@app/shared/infrastructure/transport/commands/SessionCommands';

@Injectable()
export class SessionService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy) {}

  async add(data: AddSessionDto) {
    return await lastValueFrom(this.mainClient.send(SessionCommands.ADD_SESSION, data));
  }

  async terminate(id: string) {
    return await lastValueFrom(this.mainClient.send(SessionCommands.TERMINATE_SESSION, id));
  }
}
