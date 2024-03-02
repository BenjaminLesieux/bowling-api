import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroservicesModule } from '@app/shared';
import { AUTH_MICROSERVICE, MAIN_MICROSERVICE } from '@app/shared/services';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  DB_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
      envFilePath: './apps/bowling-gateway/.env',
    }),
    MicroservicesModule.register({
      name: AUTH_MICROSERVICE,
    }),
    MicroservicesModule.register({
      name: MAIN_MICROSERVICE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
