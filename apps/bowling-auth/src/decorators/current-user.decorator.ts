import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import AuthCommands from '@app/shared/infrastructure/transport/commands/AuthCommands';
import { User } from '../database/schemas';

export function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    const msgPattern = context.switchToRpc().getContext<RmqContext>().getPattern();

    if (msgPattern === JSON.stringify(AuthCommands.LOGIN)) {
      return context.switchToRpc().getData();
    }

    return context.switchToRpc().getData().user;
  }
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
