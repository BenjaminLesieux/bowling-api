import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { BowlingAuthService } from '../bowling-auth.service';
import { User } from '../database/schemas';

export class JwtAuthGuard implements CanActivate {
  @Inject()
  private authService: BowlingAuthService;

  async canActivate(context: ExecutionContext) {
    const token = context.switchToRpc().getData().Authentication;
    if (!token) {
      return false;
    } else {
      const validated = await this.authService.validateToken(token);
      await this.addUser(
        {
          id: validated.userId,
          email: validated.email,
          role: validated.role,
          password: undefined,
        },
        context,
      );
      return !!validated;
    }
  }

  private async addUser(user: User, context: ExecutionContext) {
    context.switchToRpc().getData().user = {
      ...user,
      password: undefined,
    };
  }
}
