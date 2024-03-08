import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class RpcReqInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) =>
        context.getType() === 'http'
          ? {
              ...data[0],
              Authentication: context.switchToRpc().getData().cookies.Authentication,
            }
          : data,
      ),
    );
  }
}
