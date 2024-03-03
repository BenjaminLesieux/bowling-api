import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_MICROSERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);

    return this.authClient
      .send(
        {
          cmd: 'validate-user',
        },
        {
          Authentication: authentication,
        },
      )
      .pipe(
        tap((response) => {
          this.addUser(response, context);
        }),
        catchError((error) => {
          throw new UnauthorizedException(
            'Invalid authentication token:' + error,
          );
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;

    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication;
    }

    if (!authentication) {
      throw new UnauthorizedException('No authentication token provided');
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
