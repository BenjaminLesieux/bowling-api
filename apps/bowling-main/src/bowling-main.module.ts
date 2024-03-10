import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';
import { AuthenticationModule, DatabaseModule, MAILER_MICROSERVICE, MAIN_MICROSERVICE, MicroservicesModule, PAYMENT_MICROSERVICE } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { QrcodeService } from './qrcode/qrcode.service';
import { BowlingParksController } from './bowling-parks/bowling-parks.controller';
import { BowlingParksService } from './bowling-parks/bowling-parks.service';
import { BowlingAlleysController } from './bowling-alleys/bowling-alleys.controller';
import { BowlingAlleysService } from './bowling-alleys/bowling-alleys.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { SessionController } from './session/session.controller';
import { SessionService } from './session/session.service';
import { FakerController } from './faker/faker.controller';
import { FakerService } from './faker/faker.service';
import schemas from './database/schemas';

const envSchema = z.object({
  DB_MAIN_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
  RABBITMQ_PAYMENT_QUEUE: z.string(),
  BASE_URL: z.string().url(),
});

@Module({
  imports: [
    MicroservicesModule,
    AuthenticationModule,
    ProductModule,
    DatabaseModule.register(MAIN_MICROSERVICE, schemas),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
    MicroservicesModule.register({
      name: PAYMENT_MICROSERVICE,
    }),
    MicroservicesModule.register({
      name: MAILER_MICROSERVICE,
    }),
  ],
  controllers: [BowlingMainController, BowlingParksController, BowlingAlleysController, OrderController, SessionController, FakerController],
  providers: [BowlingMainService, BowlingParksService, QrcodeService, BowlingAlleysService, OrderService, SessionService, FakerService],
})
export class BowlingMainModule {}
