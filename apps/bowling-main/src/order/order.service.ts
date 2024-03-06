import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import schemas, { Order, orders } from '../database/schemas';
import { eq } from 'drizzle-orm';
import { GetOrdersDto } from './dto/get-orders.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

  async createOrder(id: string, userId: string) {
    return (
      await this.db
        .insert(schemas.orders)
        .values({
          status: 'pending',
          id: id,
          userId: userId,
          totalAmount: 0,
          payedAmount: 0,
        })
        .returning()
    )[0];
  }

  async updateOrder(id: string, data: Partial<Omit<Order, 'id'>>) {
    return (await this.db.update(schemas.orders).set(data).where(eq(orders.id, id)).returning())[0];
  }

  async getOrders(data: GetOrdersDto) {
    try {
      const query = this.db.select().from(orders).where(eq(orders.userId, data.userId));
      if (data.limit) {
        query.limit(data.limit);
      }
      if (data.page) {
        query.offset((data.page - 1) * data.limit);
      }
      return query.execute();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
