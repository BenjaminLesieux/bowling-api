import { Inject, Injectable } from '@nestjs/common';
import { AUTH_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { LogUserDto } from './dto/log-user.dto';
import { LoggedUserResponseDto } from './dto/logged-user-response.dto';
import AuthCommands from '@app/shared/infrastructure/transport/commands/AuthCommands';

@Injectable()
export class AuthenticationService {
  constructor(@Inject(AUTH_MICROSERVICE) private readonly client: ClientProxy) {}

  async register(user: CreateUserDto) {
    return await lastValueFrom(this.client.send(AuthCommands.CREATE_USER, user));
  }

  async login(user: LogUserDto, res): Promise<LoggedUserResponseDto> {
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

    res.send(response);
  }

  async logout(res) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
