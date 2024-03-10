import { Module } from '@nestjs/common';
import { AuthenticationModule, MAILER_MICROSERVICE, MAIN_MICROSERVICE, MicroservicesModule, PAYMENT_MICROSERVICE } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import {
  AuthenticationController,
  AuthenticationService,
  BowlingAlleysController,
  BowlingAlleysService,
  BowlingParksController,
  BowlingParksService,
  EmailController,
  EmailService,
  ProductController,
  ProductService,
  SessionController,
  SessionService,
  StripeController,
  StripeService,
  OrdersController,
  OrdersService,
  FakerController,
  FakerService,
} from './http';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_AUTH_QUEUE: z.string(),
  RABBITMQ_MAIN_QUEUE: z.string(),
  RABBITMQ_MAILER_QUEUE: z.string(),
  RABBITMQ_PAYMENT_QUEUE: z.string(),
  STRIPE_SK_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
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
    MicroservicesModule.register({
      name: MAILER_MICROSERVICE,
    }),
  ],

  controllers: [
    ProductController,
    AuthenticationController,
    BowlingParksController,
    BowlingAlleysController,
    StripeController,
    SessionController,
    EmailController,
    OrdersController,
    FakerController,
  ],
  providers: [
    ProductService,
    OrdersService,
    AuthenticationService,
    BowlingParksService,
    BowlingAlleysService,
    StripeService,
    SessionService,
    EmailService,
    FakerService,
  ],
})
export class AppModule {}
