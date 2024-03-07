import { ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@app/shared/database/schemas/schemas';
import { JwtAuthGuard } from '@app/shared';

@Injectable()
export class RoleGuard extends JwtAuthGuard {
  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    if (!roles) {
      throw new HttpException('Not roles where provider for RoleGuard', HttpStatus.UNAUTHORIZED);
    }

    if (!(await super.canActivate(context))) {
      throw new HttpException('User is not logged in or token has expired', HttpStatus.UNAUTHORIZED);
    }

    const request = context.switchToHttp().getRequest();
    const user = JSON.parse(request.cookies.User) as User;

    if (!user) {
      throw new HttpException('User is not logged in or token has expired', HttpStatus.UNAUTHORIZED);
    }

    if (roles.includes(user.role)) {
      return true;
    } else throw new HttpException(`User has role ${user.role}, not included in authorized roles: ${roles.join(',')}`, HttpStatus.UNAUTHORIZED);
  }
}
