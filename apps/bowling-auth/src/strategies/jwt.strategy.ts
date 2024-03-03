import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../bowling-auth.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          console.log(req);
          return req?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ userId }: TokenPayload) {
    try {
      return await this.usersService.getBy({ id: userId });
    } catch (error) {
      throw new UnauthorizedException('Authentication token is not valid');
    }
  }
}
