import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: uuid('id').defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

export const productTable = pgTable('products', {
  id: uuid('id').defaultRandom(),
  name: varchar('name', { length: 255 }).unique(),
  price: varchar('price', { length: 255 }),
});

export const orderTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  productId: uuid('product_id'),
  stripeCheckOutSessionId: varchar('stripe_checkout_session_id', { length: 255 }),
  status: varchar('status', { length: 255 }),
});

export type User = typeof userTable.$inferSelect;
export type Product = typeof productTable.$inferSelect;
export type Order = typeof orderTable.$inferSelect;

export default {
  userTable,
  productTable,
  orderTable,
};
