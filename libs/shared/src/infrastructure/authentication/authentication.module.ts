import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { MicroservicesModule } from '@app/shared/infrastructure/transport/microservices.module';
import { AUTH_MICROSERVICE } from '@app/shared/infrastructure/transport/services';

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
