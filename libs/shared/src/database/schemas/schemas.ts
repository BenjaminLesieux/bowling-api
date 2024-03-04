import { date, integer, pgEnum, pgTable, primaryKey, unique, uuid, varchar } from 'drizzle-orm/pg-core';
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

export const orderTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id'),
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

export const sessionStatus = pgEnum('session_status', ['finished', 'started', 'payment_pending']);

export const sessionTable = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  start: date('start').defaultNow(),
  end: date('end'),
  status: sessionStatus('status').default('started'),
  bowlingAlleyId: uuid('bowling_alley_id'),
  orderId: uuid('order_id'),
  userId: uuid('user_id'),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  bowlingAlley: one(bowlingAlleyTable, {
    fields: [sessionTable.bowlingAlleyId],
    references: [bowlingAlleyTable.id],
  }),
  order: one(orderTable, {
    fields: [sessionTable.orderId],
    references: [orderTable.id],
  }),
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const bowlingParkToProductsTable = pgTable(
  'bowling_park_to_products',
  {
    bowlingParkId: uuid('bowling_park_id').references(() => bowlingParkTable.id),
    productId: uuid('product_id').references(() => productTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bowlingParkId, t.productId] }),
  }),
);

export const bowlingParkToProductsRelations = relations(bowlingParkToProductsTable, ({ one }) => ({
  bowlingParkTable: one(bowlingParkTable, {
    fields: [bowlingParkToProductsTable.bowlingParkId],
    references: [bowlingParkTable.id],
  }),
  product: one(products, {
    fields: [bowlingParkToProductsTable.productId],
    references: [products.id],
  }),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const bowlingParksRelations = relations(bowlingParkTable, ({ many }) => ({
  products: many(bowlingParkToProductsTable),
  bowlingAlleys: many(bowlingAlleyTable),
}));

const bowlingAlleysRelations = relations(bowlingAlleyTable, ({ one, many }) => ({
  bowlingPark: one(bowlingParkTable, {
    fields: [bowlingAlleyTable.bowlingParkId],
    references: [bowlingParkTable.id],
  }),
  sessions: many(sessionTable),
}));

export const productRelations = relations(productTable, ({ many }) => ({
  bowlingParks: many(bowlingParkToProductsTable),
}));

export const orderRelations = relations(orderTable, ({ one, many }) => ({
  session: one(sessionTable),
  products: many(productTable),
}));

export type User = typeof userTable.$inferSelect;
export type Product = typeof productTable.$inferSelect;
export type BowlingPark = typeof bowlingParkTable.$inferSelect;
export type AddBowlingPark = typeof bowlingParkTable.$inferInsert;
export type BowlingAlley = typeof bowlingAlleyTable.$inferSelect;
export type AddBowlingAlley = typeof bowlingAlleyTable.$inferInsert;
export type Order = typeof orderTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;

export default {
  userTable,
  productTable,
  bowlingParkTable,
  bowlingAlleyTable,
  bowlingParksRelations,
  bowlingAlleysRelations,
  productRelations,
  orderTable,
  userRelations,
  orderRelations,
  sessionRelations,
};
