import { integer, pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const bowlingParkTable = pgTable('bowling_parks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }).notNull(),
});

export const bowlingAlleyTable = pgTable('bowling_alleys', {
  id: uuid('id').defaultRandom().primaryKey(),
  laneNumber: integer('lane_number').notNull(),
  bowlingParkId: uuid('bowling_park_id')
    .notNull()
    .references(() => bowlingParkTable.id),
});

const bowlingParksRelations = relations(bowlingParkTable, ({ many }) => ({
  products: many(productTable),
  bowlingAlleys: many(bowlingAlleyTable),
}));
const bowlingAlleysRelations = relations(bowlingAlleyTable, ({ one }) => ({
  bowlingPark: one(bowlingParkTable),
}));
const productRelations = relations(productTable, ({ many }) => ({
  bowlingParks: many(bowlingParkTable),
}));

export const orderTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id'),
  productId: uuid('product_id'),
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', {
    length: 255,
  }),
  status: varchar('status', { length: 255 }),
});

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: varchar('name', { length: 255 }),
    price: varchar('price', { length: 255 }),
  },
  (table) => {
    return {
      productsNameUnique: unique('products_name_unique').on(table.name),
    };
  },
);

export type User = typeof userTable.$inferSelect;
export type Product = typeof productTable.$inferSelect;
export type BowlingPark = typeof bowlingParkTable.$inferSelect;
export type AddBowlingPark = typeof bowlingParkTable.$inferInsert;
export type BowlingAlley = typeof bowlingAlleyTable.$inferSelect;
export type AddBowlingAlley = typeof bowlingAlleyTable.$inferInsert;
export type Order = typeof orderTable.$inferSelect;

export default {
  userTable,
  productTable,
  bowlingParkTable,
  bowlingAlleyTable,
  bowlingParksRelations,
  bowlingAlleysRelations,
  productRelations,
  orderTable,
};
