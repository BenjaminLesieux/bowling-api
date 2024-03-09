import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Logger, Provider } from '@nestjs/common';

export const DATABASE_PROVIDER = 'DATABASE_CONNECTION';

export type PostgresDatabase<T extends Record<string, unknown>> = PostgresJsDatabase<T>;

const logger = new Logger('DatabaseProvider');

export function databaseProvider(database: string, schema: Record<string, unknown>): Provider {
  logger.log(`Creating database provider for ${database}`);
  return {
    provide: DATABASE_PROVIDER,
    useFactory: async (configService: ConfigService) => {
      const connectionUrl = configService.get<string>(`DB_${database}_URL`);
      const queryClient = postgres(connectionUrl, { max: 1 });
      logger.log(`Connected to ${database} database`);
      return drizzle(queryClient, schema) satisfies PostgresDatabase<typeof schema>;
    },
    inject: [ConfigService],
  };
}
