import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './libs/shared/src/database/schemas/schemas.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
}) satisfies Config;