import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { orders } from '@app/shared/database/schemas/schemas';
import { eq, and, sql } from 'drizzle-orm';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AddProductDto } from './dto/addProductDto';
import { ordersToProductsTable } from '@app/shared/database/schemas/schemas';
import schemas from '../database/schemas';
import { takeUniqueOrThrow } from '../database/helpers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
    @Inject(PAYMENT_MICROSERVICE) private readonly paymentClient: ClientProxy,
  ) {}
  async getById(id: string) {
    try {
      const order = await this.db.select().from(schemas.orders).where(eq(orders.id, id));
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async checkout(payload: { orderId: string; amountToPay: number; userId: string }) {
    try {
      const order = await this.db.select().from(schemas.orders).where(eq(orders.id, payload.orderId)).then(takeUniqueOrThrow);
      console.log('order', order);
      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order already checked out');

      // first we should check if transaction is not already pending
      const transaction = await this.db
        .select()
        .from(schemas.transactions)
        .where(and(eq(schemas.transactions.orderId, payload.orderId), eq(schemas.transactions.status, 'pending')))
        .limit(1);

      if (transaction.length > 0) {
        throw new RpcException({
          message: 'Transaction already pending',
          code: 400,
        });
      }

      const res = await lastValueFrom(this.paymentClient.send({ cmd: 'create-checkout-session' }, payload));
      console.log('res in main microservice', res);

      await this.db.insert(schemas.transactions).values({
        orderId: payload.orderId,
        amount: payload.amountToPay,
        userId: payload.userId,
        status: 'pending',
        stripeCheckoutSessionId: res.id,
      });

      return res.url;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async addProductToOrder(payload: AddProductDto) {
    try {
      console.log('payload in main microservice', payload);
      const order = await this.db.select().from(schemas.orders).where(eq(orders.id, payload.orderId)).then(takeUniqueOrThrow);

      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order already checked out');

      let addedAmount = 0;

      for (const product of payload.products) {
        const productData = await this.db.select().from(schemas.products).where(eq(schemas.products.id, product.id)).then(takeUniqueOrThrow);
        addedAmount += parseInt(productData.price) * product.quantity;
        // query it, if exists add the quantity, if not, create it
        const orderToProductData = await this.db
          .select()
          .from(ordersToProductsTable)
          .where(and(eq(ordersToProductsTable.orderId, payload.orderId), eq(ordersToProductsTable.productId, product.id)))
          .then(takeUniqueOrThrow);
        if (orderToProductData) {
          await this.db
            .update(ordersToProductsTable)
            .set({ quantity: sql`${ordersToProductsTable.quantity} + ${product.quantity}` })
            .where(and(eq(ordersToProductsTable.orderId, payload.orderId), eq(ordersToProductsTable.productId, product.id)));
        } else {
          await this.db.insert(ordersToProductsTable).values({
            orderId: payload.orderId,
            productId: product.id,
            quantity: product.quantity,
          });
        }
      }

      // this will increment (so if 2 people adds products at the same time, it will not override the totalAmount)
      await this.db
        .update(orders)
        .set({ totalAmount: sql`${orders.totalAmount} + ${addedAmount}` })
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
