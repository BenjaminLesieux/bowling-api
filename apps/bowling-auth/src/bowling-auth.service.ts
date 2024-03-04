import { Injectable } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { UsersService } from './users/users.service';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

@Injectable()
export class BowlingAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async loginMicroservice(user: User, context: RmqContext) {
    const foundUser = await this.userService.getBy({ email: user.email });
    const tokenPayload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
    const token = this.jwtService.sign(tokenPayload);
    const t = {
      user: {
        ...foundUser,
        password: undefined,
      },
      token,
      expiresIn: expires.getTime(),
    };
    return t;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch (error) {
      throw new RpcException({
        message: error.message,
      });
    }
  }

  async logout(response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }
}
