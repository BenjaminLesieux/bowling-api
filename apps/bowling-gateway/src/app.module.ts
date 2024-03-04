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
import { BowlingParksController } from './bowling-parks/bowling-parks.controller';
import { BowlingParksService } from './bowling-parks/bowling-parks.service';
import { BowlingAlleysService } from './bowling-alleys/bowling-alleys.service';
import { BowlingAlleysController } from './bowling-alleys/bowling-alleys.controller';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_AUTH_QUEUE: z.string(),
  RABBITMQ_MAIN_QUEUE: z.string(),
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
  ],
  controllers: [
    AppController,
    ProductController,
    AuthenticationController,
    BowlingParksController,
    BowlingAlleysController,
    StripeController,
    EmailController,
  ],
  providers: [
    AppService,
    ProductService,
    AuthenticationService,
    BowlingParksService,
    BowlingAlleysService,
    StripeService,
    EmailService,
  ],
})
export class AppModule {}
