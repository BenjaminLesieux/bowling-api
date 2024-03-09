import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/shared/adapters/user.type';

export function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'http') {
    return JSON.parse(context.switchToHttp().getRequest().cookies.User);
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
}

export const ReqUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
