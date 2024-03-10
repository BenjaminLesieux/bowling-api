import { User } from '@app/shared';
import { Injectable, Inject } from '@nestjs/common';
import schemas, { orders } from '../database/schemas';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';

import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

@Injectable()
export class FakerService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}
  async init(data: User) {
    // create products
    for (let i = 0; i < 10; i++) {
      await this.db.insert(schemas.products).values({
        name: faker.commerce.productName(),
        // price should be between 100 and 1000
        price: (Math.floor(Math.random() * 900) + 100).toString(),
      });
    }

    // create bowling parks
    for (let i = 0; i < 10; i++) {
      await this.db.insert(schemas.bowlingParks).values({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
      });
    }

    // go through all the bowlingParks and create some lanes
    const bowlingParks = await this.db.select().from(schemas.bowlingParks).execute();
    for (const park of bowlingParks) {
      for (let i = 0; i < 10; i++) {
        /*
        id: uuid('id').defaultRandom().primaryKey(),
        laneNumber: integer('lane_number').notNull(),
        bowlingParkId: uuid('bowling_park_id')
          .notNull()
          .references(() => bowlingParks.id),
        */

        await this.db.insert(schemas.bowlingAlleys).values({
          laneNumber: i,
          bowlingParkId: park.id,
        });
      }
      // let's add some products to the catalog
      const products = await this.db.select().from(schemas.products).execute();
      for (const product of products) {
        await this.db.insert(schemas.catalog).values({
          productId: product.id,
          bowlingParkId: park.id,
        });
      }
    }

    const order = await this.db
      .insert(schemas.orders)
      .values({
        userId: data.id,
      })
      .returning();

    // create a session in a bowlingAlley
    const bowlingAlleys = await this.db.select().from(schemas.bowlingAlleys).limit(1);
    const session = await this.db
      .insert(schemas.sessions)
      .values({
        userId: data.id,
        bowlingAlleyId: bowlingAlleys[0].id,
        orderId: order[0].id,
      })
      .returning();

    // create an order linked to the session

    //fint the order linked to the session
    const products = await this.db.select().from(schemas.products).limit(3);

    console.log(order);

    let price = 0;
    for (const product of products) {
      const quantity = Math.floor(Math.random() * 10);
      await this.db.insert(schemas.ordersToProductsTable).values({
        orderId: session[0].orderId,
        productId: product.id,
        quantity,
      });

      //increment the total amount
      price += parseInt(product.price) * quantity;
    }

    //update the order with the total amount
    await this.db.update(schemas.orders).set({ totalAmount: price, payedAmount: 0 }).where(eq(orders.id, order[0].id));

    return 'Order Id is  ' + session[0].orderId;
  }
}
