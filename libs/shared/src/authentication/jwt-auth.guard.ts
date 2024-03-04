import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@app/shared/database/schemas/schemas';
import { catchError, lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_MICROSERVICE) private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext) {
    const authentication = this.getAuthentication(context);
    console.log(authentication);

    const res = await lastValueFrom<User>(
      this.authClient
        .send(
          {
            cmd: 'validate-user',
          },
          {
            Authentication: authentication,
          },
        )
        .pipe(
          catchError((err) => {
            throw new UnauthorizedException(err);
          }),
        ),
    );

    if (res) {
      this.addUser(res, context);
    }

    return !!res;
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;

    if (context.getType() === 'rpc') {
      console.log(context.switchToRpc().getData());
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest().cookies?.Authentication;
    }

    if (!authentication) {
      throw new UnauthorizedException('No authentication token provided');
    }
    return authentication;
  }

  private addUser(user: User, context: ExecutionContext) {
    context.switchToRpc().getData().user = {
      ...user,
      password: undefined,
    };
  }
}
