import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { orders } from '@app/shared/database/schemas/schemas';
import { eq } from 'drizzle-orm';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AddProductDto } from './dto/addProductDto';
import { ordersToProductsTable } from '@app/shared/database/schemas/schemas';
import schemas from '../database/schemas';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}
  async getById(id: string) {
    try {
      const order = await this.db.query.orders.findFirst({
        where: eq(orders.id, id),
      });
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async checkout(payload: { orderId: string; amountToPay: number }) {
    try {
      const order = await this.db.query.orders.findFirst({
        where: eq(orders.id, payload.orderId),
      });

      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order already checked out');
      await lastValueFrom(this.paymentClient.send({ cmd: 'create-checkout-session' }, payload));

      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async addProduct(payload: AddProductDto) {
    try {
      console.log('payload in main microservice', payload);
      const order = await this.db.query.orders.findFirst({
        where: eq(orders.id, payload.orderId),
      });

      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order already checked out');

      let addedAmount;

      for (const product of payload.products) {
        const productData = await this.db.query.products.findFirst({
          where: eq(orders.id, payload.orderId),
        });
        addedAmount += parseInt(productData.price) * product.quantity;
        await this.db.insert(ordersToProductsTable).values({
          orderId: payload.orderId,
          productId: product.id,
          quantity: product.quantity,
        });
      }

      // this will increment (so if 2 people adds products at the same time, it will not override the totalAmount)
      await this.db
        .update(orders)
        .set({ totalAmount: orders.totalAmount + addedAmount })
        .where(eq(orders.id, payload.orderId));

      //upgrade total price

      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async createOrder(id: string, userId: string) {
    return this.db
      .insert(schemas.orders)
      .values({
        status: 'pending',
        id: id,
        userId: userId,
      })
      .returning();
  }
}
