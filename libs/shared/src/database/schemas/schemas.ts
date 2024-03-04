import { date, integer, pgEnum, pgTable, primaryKey, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

export const bowlingParks = pgTable('bowling_parks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }).notNull(),
});

export const bowlingAlleys = pgTable('bowling_alleys', {
  id: uuid('id').defaultRandom().primaryKey(),
  laneNumber: integer('lane_number').notNull(),
  bowlingParkId: uuid('bowling_park_id')
    .notNull()
    .references(() => bowlingParks.id),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id'),
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', {
    length: 255,
  }),
  status: varchar('status', { length: 255 }),
  totalAmount: integer('total_amount'),
  payedAmount: integer('payed_amount'),
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

export const sessionStatus = pgEnum('session_status', ['finished', 'started', 'payment_pending']);

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  start: date('start').defaultNow(),
  end: date('end'),
  status: sessionStatus('status').default('started'),
  bowlingAlleyId: uuid('bowling_alley_id'),
  orderId: uuid('order_id'),
  userId: uuid('user_id'),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  bowlingAlley: one(bowlingAlleys, {
    fields: [sessions.bowlingAlleyId],
    references: [bowlingAlleys.id],
  }),
  order: one(orders, {
    fields: [sessions.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const bowlingParkToProductsTable = pgTable(
  'bowling_parks_to_products',
  {
    bowlingParkId: uuid('bowling_park_id')
      .notNull()
      .references(() => bowlingParks.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
  },
  (t) => ({
    pk: primaryKey(t.bowlingParkId, t.productId),
  }),
);

export const bowlingParkToProductsRelations = relations(bowlingParkToProductsTable, ({ one }) => ({
  bowlingParks: one(bowlingParks, {
    fields: [bowlingParkToProductsTable.bowlingParkId],
    references: [bowlingParks.id],
  }),
  product: one(products, {
    fields: [bowlingParkToProductsTable.productId],
    references: [products.id],
  }),
}));

export const ordersToProductsTable = pgTable(
  'orders_to_products',
  {
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
  },
  (t) => ({
    pk: primaryKey(t.orderId, t.productId),
  }),
);

export const ordersToProductsRelations = relations(ordersToProductsTable, ({ one }) => ({
  order: one(orders, {
    fields: [ordersToProductsTable.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [ordersToProductsTable.productId],
    references: [products.id],
  }),
}));

export const bowlingAlleysRelations = relations(bowlingAlleys, ({ one, many }) => ({
  bowlingPark: one(bowlingParks, {
    fields: [bowlingAlleys.bowlingParkId],
    references: [bowlingParks.id],
  }),
  sessions: many(sessions),
}));

export const bowlingParksRelations = relations(bowlingParks, ({ many }) => ({
  products: many(bowlingParkToProductsTable),
  bowlingAlleys: many(bowlingAlleys),
}));

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const productRelations = relations(products, ({ many }) => ({
  bowlingParks: many(bowlingParkToProductsTable),
  orders: many(ordersToProductsTable),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  session: one(sessions),
  products: many(ordersToProductsTable),
}));

/*
 */

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type BowlingPark = typeof bowlingParks.$inferSelect;
export type AddBowlingPark = typeof bowlingParks.$inferInsert;
export type BowlingAlley = typeof bowlingAlleys.$inferSelect;
export type AddBowlingAlley = typeof bowlingAlleys.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export default {
  users,
  products,
  bowlingParks,
  bowlingAlleys,
  orders,
  bowlingParksRelations,
  bowlingAlleysRelations,
  productRelations,
  userRelations,
  orderRelations,
  sessionRelations,
};
