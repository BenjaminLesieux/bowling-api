import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/shared/database/schemas/schemas';
import { RmqContext } from '@nestjs/microservices';

export function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    const msgPattern = context.switchToRpc().getContext<RmqContext>().getPattern();

    if (msgPattern === JSON.stringify({ cmd: 'login' })) {
      return context.switchToRpc().getData();
    }

    console.log(context.switchToRpc().getData());

    return context.switchToRpc().getData().user;
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
