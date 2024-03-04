import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';
import { AuthenticationModule, MicroservicesModule } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { QrcodeService } from './qrcode/qrcode.service';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
  RABBITMQ_PAYMENT_QUEUE: z.string(),
});

@Module({
  imports: [
    MicroservicesModule,
    AuthenticationModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
    MicroservicesModule.register({
      name: PAYMENT_MICROSERVICE,
    }),
  ],
  controllers: [BowlingMainController],
  providers: [BowlingMainService, QrcodeService],
})
export class BowlingMainModule {}
