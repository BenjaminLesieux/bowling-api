import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schemas.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_MAIN_URL,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
