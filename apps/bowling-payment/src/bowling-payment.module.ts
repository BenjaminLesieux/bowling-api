import { Module } from '@nestjs/common';
import { BowlingPaymentController } from './bowling-payment.controller';
import { BowlingPaymentService } from './bowling-payment.service';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  STRIPE_SK_KEY: z.string(),
  STRIPE_PK_KEY: z.string(),
  STRIPE_CURRENCY: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: './apps/bowling-payment/.env',
    }),
  ],
  controllers: [BowlingPaymentController],
  providers: [BowlingPaymentService],
})
export class BowlingPaymentModule {}
