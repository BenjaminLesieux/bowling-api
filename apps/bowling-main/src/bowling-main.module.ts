import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';
import {
  AuthenticationModule,
  DatabaseModule,
  MicroservicesModule,
} from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { BowlingParksController } from './bowling-parks/bowling-parks.controller';
import { BowlingParksService } from './bowling-parks/bowling-parks.service';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
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
  ],
  controllers: [BowlingMainController, BowlingParksController],
  providers: [BowlingMainService, BowlingParksService],
})
export class BowlingMainModule {}
