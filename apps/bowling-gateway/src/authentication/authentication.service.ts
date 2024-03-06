import { Inject, Injectable } from '@nestjs/common';
import { AUTH_MICROSERVICE, MAILER_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom, tap } from 'rxjs';
import { User } from '@app/shared/adapters/user.type';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly client: ClientProxy,
    @Inject(MAILER_MICROSERVICE) private readonly mailer: ClientProxy,
  ) {}

  async register(user: CreateUserDto) {
    return await lastValueFrom(
      this.client
        .send(
          {
            cmd: 'create-user',
          },
          user,
        )
        .pipe(
          tap(async (user: User) => {
            await lastValueFrom(this.mailer.emit({ cmd: 'on-user-register' }, user));
          }),
        ),
    );
  }

  async login(user: CreateUserDto, res) {
    const response = await lastValueFrom(
      this.client.send(
        {
          cmd: 'login',
        },
        user,
      ),
    );

    res.cookie('Authentication', response.token, {
      httpOnly: true,
    });
    res.cookie('User', JSON.stringify(response.user), {
      httpOnly: true,
    });
  }

  async logout(res) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  async getMe() {}
}
