import { Injectable } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RmqContext } from '@nestjs/microservices';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class BowlingAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const tokenPayload: TokenPayload = { userId: user.id };
    return this.jwtService.sign(tokenPayload);
  }

  async logout(response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
