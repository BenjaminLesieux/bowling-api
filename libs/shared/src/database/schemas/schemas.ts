import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: uuid('id').defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

export type User = typeof userTable.$inferSelect;

export default {
  userTable,
};
