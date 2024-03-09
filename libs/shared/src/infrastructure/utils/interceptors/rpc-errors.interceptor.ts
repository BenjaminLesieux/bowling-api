import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class RpcErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        return throwError(() => {
          throw new HttpException(error.message, error.status === 'error' ? 500 : error.status);
        });
      }),
    );
  }
}
