import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { getCurrentUserByContext } from '../decorators/current-user.decorator';

export class LocalAuthGuard implements CanActivate {
  @Inject()
  private usersService: UsersService;

  async canActivate(context: ExecutionContext) {
    const user = getCurrentUserByContext(context);
    if (!user) {
      return false;
    } else {
      const validated = await this.usersService.validate(user.email, user.password);
      return !!validated;
    }
  }
}
