import { Module } from '@nestjs/common';
import { BowlingAuthController } from './bowling-auth.controller';
import { BowlingAuthService } from './bowling-auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule, MicroservicesModule } from '@app/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

const envSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  DB_URL: z.string(),
});

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      envFilePath: './apps/bowling-auth/.env',
    }),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    MicroservicesModule,
  ],
  controllers: [BowlingAuthController],
  providers: [BowlingAuthService, LocalStrategy, JwtStrategy],
})
export class BowlingAuthModule {}
