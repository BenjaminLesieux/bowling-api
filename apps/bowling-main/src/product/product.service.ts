import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';

import { Product, productTable, userTable } from '@app/shared/database/schemas/schemas';

import { withCursorPagination } from 'drizzle-pagination';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase) {}

  async getProducts(lastItem: string | null) {
    try {
      console.log('im called');
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
  async addProduct(data: Omit<Product, 'id'>) {
    try {
      const existingProduct = await this.db.query.productTable.findFirst({
        where: eq(productTable.name, data.name),
      });

      if (existingProduct) throw new Error(`Product ${existingProduct.name} already exists`);

      const product = await this.db.insert(productTable).values(data);
      return product;
    } catch (err) {
      console.log(`Error adding product`, data);
      throw err;
    }
  }

  async updateProduct(data: Product) {
    try {
      const product = await this.db
        .update(productTable)
        .set({
          name: data.name,
          price: data.price,
        })
        .where(eq(productTable.id, data.id));
      return product;
    } catch (err) {
      console.log('Error updating product', data);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.db.delete(productTable).where(eq(productTable.id, id));
    } catch (err) {
      console.log('Error delete product', id);
    }
  }
}
