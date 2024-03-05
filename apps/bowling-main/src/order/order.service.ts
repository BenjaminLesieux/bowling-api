import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import schemas from '../database/schemas';

@Injectable()
export class OrderService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

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
