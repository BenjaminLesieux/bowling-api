import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule, MicroservicesModule } from '@app/shared';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_AUTH_QUEUE: z.string(),
  RABBITMQ_MAIN_QUEUE: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
    AuthenticationModule,
    MicroservicesModule.register({
      name: MAIN_MICROSERVICE,
    }),
    MicroservicesModule.register({
      name: PAYMENT_MICROSERVICE,
    }),
  ],
  controllers: [AppController, ProductController, AuthenticationController],
  providers: [AppService, ProductService, AuthenticationService],
})
export class AppModule {}
