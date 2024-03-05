import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('user_role', ['admin', 'manager', 'user']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  role: userRoles('role').default('user'),
  password: varchar('password', { length: 255 }),
});

export type User = typeof users.$inferSelect;

export default {
  userRoles,
  users,
};
