import { Module } from '@nestjs/common';
import { BowlingMailerController } from './bowling-mailer.controller';
import { BowlingMailerService } from './bowling-mailer.service';
import { MicroservicesModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  RABBITMQ_URL: z.string().url(),
  RABBITMQ_MAILER_QUEUE: z.string(),
  GMAIL_USER: z.string(),
  GMAIL_CLIENT_SECRET: z.string(),
  GMAIL_CLIENT_ID: z.string(),
  GMAIL_REFRESH_TOKEN: z.string(),
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
