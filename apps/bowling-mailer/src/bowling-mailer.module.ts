import { Module } from '@nestjs/common';
import { BowlingMailerController } from './bowling-mailer.controller';
import { BowlingMailerService } from './bowling-mailer.service';
import { MicroservicesModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAILER_QUEUE: z.string(),
});

@Module({
  imports: [
    MicroservicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
    }),
  ],
  controllers: [BowlingMailerController],
  providers: [BowlingMailerService],
})
export class BowlingMailerModule {}
