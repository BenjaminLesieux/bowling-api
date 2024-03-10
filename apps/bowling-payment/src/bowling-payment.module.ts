import { Module } from '@nestjs/common';
import { BowlingPaymentController } from './bowling-payment.controller';
import { BowlingPaymentService } from './bowling-payment.service';

import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { MAIN_MICROSERVICE, DatabaseModule, AuthenticationModule, MicroservicesModule } from '@app/shared';
import schemas from '../../bowling-main/src/database/schemas';

const envSchema = z.object({
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
  RABBITMQ_PAYMENT_QUEUE: z.string(),
  STRIPE_SK_KEY: z.string(),
  STRIPE_PK_KEY: z.string(),
});

@Module({
  imports: [
    MicroservicesModule.register({
      name: MAIN_MICROSERVICE,
    }),
    MicroservicesModule,
    AuthenticationModule,
    DatabaseModule.register(MAIN_MICROSERVICE, schemas),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
  ],
  controllers: [BowlingPaymentController],
  providers: [BowlingPaymentService],
})
export class BowlingPaymentModule {}
