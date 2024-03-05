import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';
import { AuthenticationModule, DatabaseModule, MicroservicesModule } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { QrcodeService } from './qrcode/qrcode.service';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';
import { BowlingParksController } from './bowling-parks/bowling-parks.controller';
import { BowlingParksService } from './bowling-parks/bowling-parks.service';
import { BowlingAlleysController } from './bowling-alleys/bowling-alleys.controller';
import { BowlingAlleysService } from './bowling-alleys/bowling-alleys.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

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
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
    MicroservicesModule.register({
      name: PAYMENT_MICROSERVICE,
    }),
  ],
  controllers: [BowlingMainController, BowlingParksController, BowlingAlleysController, OrderController],
  providers: [BowlingMainService, BowlingParksService, QrcodeService, BowlingAlleysService, OrderService],
})
export class BowlingMainModule {}
