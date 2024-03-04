import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { orders } from '@app/shared/database/schemas/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrderService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase) {}
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
}
