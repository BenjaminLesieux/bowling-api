import { Injectable } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Registry, collectDefaultMetrics } from 'prom-client';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class BowlingAuthService {
  registry = new Registry();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    collectDefaultMetrics({ register: this.registry })
  }

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

  async logout(response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
