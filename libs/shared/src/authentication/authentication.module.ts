import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MicroservicesModule } from '@app/shared/microservices/microservices.module';
import { AUTHENTICATION_SERVICE } from '@app/shared/authentication/constants';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    MicroservicesModule.register({
      name: AUTHENTICATION_SERVICE,
    }),
  ],
  exports: [MicroservicesModule],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
