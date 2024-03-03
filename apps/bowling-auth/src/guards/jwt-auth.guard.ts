import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { BowlingAuthService } from '../bowling-auth.service';

export class JwtAuthGuard implements CanActivate {
  @Inject()
  private authService: BowlingAuthService;

  async canActivate(context: ExecutionContext) {
    const token = context.switchToRpc().getData().Authentication;
    if (!token) {
      return false;
    } else {
      const validated = await this.authService.validateToken(token);
      return !!validated;
    }
  }
}
