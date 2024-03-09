import { Inject, Injectable } from '@nestjs/common';

import { eq, inArray } from 'drizzle-orm';
import schemas, { Product, products } from '../database/schemas';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import { RpcError } from '@app/shared/infrastructure/utils/errors/rpc-error';

@Injectable()
export class ProductService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

  async getProducts() {
    try {
      return await this.db.select().from(schemas.products).execute();
    } catch (error) {
      throw new RpcError({
        message: error.message,
        status: 500,
      });
    }
  }
  async getProductById(id: string) {
    try {
      return (await this.db.select().from(schemas.products).where(eq(schemas.products.id, id)).execute())[0];
    } catch (error) {
      throw new RpcError({
        message: error.message,
        status: 500,
      });
    }
  }
  async addProduct(data: Omit<Product, 'id'>) {
    try {
      return this.db.insert(products).values(data).returning();
    } catch (error) {
      throw new RpcError({
        message: error.message,
        status: 500,
      });
    }
  }

  async updateProduct(data: Product) {
    try {
      return await this.db
        .update(schemas.products)
        .set({
          name: data.name,
          price: data.price,
        })
        .where(eq(schemas.products.id, data.id))
        .returning();
    } catch (err) {
      console.log('Error updating product', data);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.db.delete(schemas.products).where(eq(schemas.products.id, id)).returning();
    } catch (err) {
      console.log('Error delete product', id);
    }
  }

  async getProductsByIds(data: any) {
    try {
      const ids = data.map((d) => d.id);
      return await this.db.select().from(schemas.products).where(inArray(schemas.products.id, ids)).execute();
    } catch (error) {
      throw new RpcError({
        message: error.message,
        status: 500,
      });
    }
  }
}
