import { Module } from '@nestjs/common';
import { BowlingAuthController } from './bowling-auth.controller';
import { BowlingAuthService } from './bowling-auth.service';
import { UsersModule } from './users/users.module';
import { AUTH_MICROSERVICE, DatabaseModule, MicroservicesModule } from '@app/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { JwtModule } from '@nestjs/jwt';
import schemas from './database/schemas';

const envSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  DB_AUTH_URL: z.string(),
  RABBITMQ_URL: z.string(),
  RABBITMQ_AUTH_QUEUE: z.string(),
});

@Module({
  imports: [
    DatabaseModule.register(AUTH_MICROSERVICE, schemas),
    UsersModule,
    MicroservicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BowlingAuthController],
  providers: [BowlingAuthService],
})
export class BowlingAuthModule {}
