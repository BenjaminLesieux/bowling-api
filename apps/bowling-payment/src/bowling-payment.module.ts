import { Module } from '@nestjs/common';
import { BowlingPaymentController } from './bowling-payment.controller';
import { BowlingPaymentService } from './bowling-payment.service';

import { AuthenticationModule, DatabaseModule, MicroservicesModule } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { MAIN_MICROSERVICE, PAYMENT_MICROSERVICE } from '@app/shared/services';
import schemas from '@app/shared/database/schemas/schemas';

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
    DatabaseModule.register(PAYMENT_MICROSERVICE, schemas),
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
