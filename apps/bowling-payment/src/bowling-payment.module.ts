import { Module } from '@nestjs/common';
import { BowlingPaymentController } from './bowling-payment.controller';
import { BowlingPaymentService } from './bowling-payment.service';

import { AuthenticationModule, DatabaseModule, MicroservicesModule } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
  RABBITMQ_PAYMENT_QUEUE: z.string(),
  STRIPE_SK_KEY: z.string(),
  STRIPE_PK_KEY: z.string(),
});

@Module({
  imports: [
    MicroservicesModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [BowlingPaymentController],
  providers: [BowlingPaymentService],
})
export class BowlingPaymentModule {}
