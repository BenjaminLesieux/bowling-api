import { Injectable } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RmqContext } from '@nestjs/microservices';
import { UsersService } from './users/users.service';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class BowlingAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(user: User, response) {
    const tokenPayload: TokenPayload = { userId: user.id };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async loginMicroservice(user: User, context: RmqContext) {
    const userId = user.hasOwnProperty('id')
      ? user.id
      : (
          await this.userService.getBy({
            email: user.email,
          })
        ).id;
    const tokenPayload: TokenPayload = { userId };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    const t = {
      user: {
        ...user,
        password: undefined,
      },
      token,
      expiresIn: expires.getTime(),
    };
    console.log(t);
    return t;
  }

  async validateToken(token: string) {
    const decoded = this.jwtService.decode<TokenPayload>(token);
    return this.userService.getBy({
      id: decoded.userId,
    });
  }

  async logout(response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
