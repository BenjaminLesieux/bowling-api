import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

export const productTable = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).unique(),
  price: varchar('price', { length: 255 }),
});

export type User = typeof userTable.$inferSelect;
export type Product = typeof productTable.$inferSelect;

export default {
  userTable,
  productTable,
};
