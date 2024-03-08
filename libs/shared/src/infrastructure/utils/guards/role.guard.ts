import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
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
      return false;
    }

    if (!(await super.canActivate(context))) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = JSON.parse(request.cookies.User) as User;

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
