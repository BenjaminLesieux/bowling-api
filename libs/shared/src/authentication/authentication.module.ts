import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MicroservicesModule } from '@app/shared/microservices/microservices.module';
import * as cookieParser from 'cookie-parser';
import { AUTH_MICROSERVICE } from '@app/shared/services';

@Module({
  imports: [
    MicroservicesModule.register({
      name: AUTH_MICROSERVICE,
    }),
  ],
  exports: [MicroservicesModule],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
