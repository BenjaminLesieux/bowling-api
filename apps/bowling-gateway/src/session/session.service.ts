import { MAILER_MICROSERVICE, MAIN_MICROSERVICE } from '@app/shared/services';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddSessionDto } from './dto/add-session.dto';
import { lastValueFrom, tap } from 'rxjs';
import { RpcError } from '@app/shared/rpc-error';
import { SearchSessionDto } from './dto/search-session.dto';
import { User } from '@app/shared/adapters/user.type';

@Injectable()
export class SessionService {
  constructor(
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
    @Inject(MAILER_MICROSERVICE) private readonly mailer: ClientProxy,
  ) {}

  async add(data: AddSessionDto) {
    try {
      return await lastValueFrom(
        this.mainClient.send(
          {
            cmd: 'add-session',
          },
          data,
        ),
      );
    } catch (err) {
      throw new RpcError({
        status: 400,
        message: err.message,
      });
    }
  }

  async terminate(user: User, id: string) {
    return await lastValueFrom(
      this.mainClient
        .send(
          {
            cmd: 'terminate-session',
          },
          {
            user,
            id,
          },
        )
        .pipe(
          tap((response) => {
            this.mailer.emit(
              { cmd: 'on-session-closed' },
              {
                user,
                infoData: response.info,
              },
            );
          }),
        ),
    );
  }

  async getBy(data: SearchSessionDto) {
    return await lastValueFrom(this.mainClient.send({ cmd: 'get-session-by' }, data));
  }
}
