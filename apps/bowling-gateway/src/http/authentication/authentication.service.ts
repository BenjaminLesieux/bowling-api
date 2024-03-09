import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { LogUserDto } from './dto/log-user.dto';
import AuthCommands from '@app/shared/infrastructure/transport/commands/AuthCommands';
import { AUTH_MICROSERVICE } from '@app/shared';
import { Response } from 'express';

@Injectable()
export class AuthenticationService {
  constructor(@Inject(AUTH_MICROSERVICE) private readonly client: ClientProxy) {}

  async register(user: CreateUserDto) {
    return await lastValueFrom(this.client.send(AuthCommands.CREATE_USER, user));
  }

  async login(user: LogUserDto, res: Response): Promise<void> {
    const response = await lastValueFrom(this.client.send(AuthCommands.LOGIN, user));

    res.cookie('Authentication', response.token, {
      httpOnly: true,
    });
    res.cookie('User', JSON.stringify(response.user), {
      httpOnly: true,
    });

    res.send(response);
  }

  async logout(res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
