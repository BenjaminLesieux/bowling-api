import { Inject, Injectable } from '@nestjs/common';
import { AUTH_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(AUTH_MICROSERVICE) private readonly client: ClientProxy,
  ) {}

  async register(user: CreateUserDto) {
    return await lastValueFrom(
      this.client.send(
        {
          cmd: 'create-user',
        },
        user,
      ),
    );
  }

  async login(user: CreateUserDto) {
    return this.client.send(
      {
        cmd: 'login',
      },
      user,
    );
  }
}
