import { Module } from '@nestjs/common';
import { BowlingMainController } from './bowling-main.controller';
import { BowlingMainService } from './bowling-main.service';
import { AuthenticationModule, MicroservicesModule } from '@app/shared';
import { z } from 'zod';
import { ConfigModule } from '@nestjs/config';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAIN_QUEUE: z.string(),
});

@Module({
  imports: [
    MicroservicesModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: './apps/bowling-main/.env',
    }),
  ],
  controllers: [BowlingMainController],
  providers: [BowlingMainService],
})
export class BowlingMainModule {}
