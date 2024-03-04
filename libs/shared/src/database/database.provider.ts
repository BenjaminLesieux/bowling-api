import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Logger, Provider } from '@nestjs/common';
import schema from './schemas/schemas';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

export const DATABASE_PROVIDER = 'DATABASE_CONNECTION';

export type PostgresDatabase = PostgresJsDatabase<typeof schema>;

const logger = new Logger('DatabaseProvider');

export const databaseProvider: Provider = {
  provide: DATABASE_PROVIDER,
  useFactory: async (configService: ConfigService): Promise<PostgresDatabase> => {
    const connectionUrl = configService.get('DB_URL');

    await doMigrations(connectionUrl);

    const queryClient = postgres(connectionUrl);
    return drizzle(queryClient, { schema });
  },
  inject: [ConfigService],
};

async function doMigrations(connectionUrl: string) {
  logger.log('Running migrations');
  const migrationClient = postgres(connectionUrl, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: 'migrations' });
  await migrationClient.end();
  logger.log('Migrations done');
}
