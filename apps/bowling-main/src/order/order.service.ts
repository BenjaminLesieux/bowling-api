import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { orders } from '@app/shared/database/schemas/schemas';
import { eq } from 'drizzle-orm';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase,
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
}
