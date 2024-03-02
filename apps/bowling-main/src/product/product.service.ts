import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  DATABASE_PROVIDER,
  PostgresDatabase,
} from '@app/shared/database/database.provider';
import { userTable } from '@app/shared/database/schemas/schemas';

import { withCursorPagination } from 'drizzle-pagination';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase,
  ) {}

  async getProducts(lastItem: string | null) {
    try {
      const products = await this.db.query.productTable.findMany(
        withCursorPagination({
          limit: 32,
          cursors: [[userTable.id, 'asc', lastItem]],
        }),
      );
      return products;
    } catch (error) {
      // Handle errors appropriately (e.g., log, throw, or return a default value)
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  async getProductById(id: string) {
    try {
      const product = await this.db.query.productTable.findFirst({
        where: eq(userTable.id, id),
      });
      return product;
    } catch (error) {
      // Handle errors appropriately (e.g., log, throw, or return a default value)
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}
