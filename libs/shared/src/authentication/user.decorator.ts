import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';

export function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'http') {
    return JSON.parse(context.switchToHttp().getRequest().cookies.User);
  }
  if (context.getType() === 'rpc') {
    return JSON.parse(context.switchToRpc().getData().user);
  }
}

export const ReqUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
