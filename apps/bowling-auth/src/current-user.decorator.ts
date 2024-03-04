import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';

export function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getContext().user ? context.switchToRpc().getContext().user : context.switchToRpc().getData();
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
