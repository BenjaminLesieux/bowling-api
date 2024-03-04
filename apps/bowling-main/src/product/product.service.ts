import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';

import { Product, products, users } from '@app/shared/database/schemas/schemas';

import { withCursorPagination } from 'drizzle-pagination';
import { eq, inArray } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase) {}

  async getProducts(lastItem: string | null) {
    try {
      console.log('im called');
      const products = await this.db.query.products.findMany(
        withCursorPagination({
          limit: 32,
          cursors: [[users.id, 'asc', lastItem]],
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
      const product = await this.db.query.products.findFirst({
        where: eq(users.id, id),
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
      const existingProduct = await this.db.query.products.findFirst({
        where: eq(products.name, data.name),
      });

      if (existingProduct) throw new Error(`Product ${existingProduct.name} already exists`);

      const product = await this.db.insert(products).values(data);
      return product;
    } catch (err) {
      console.log(`Error adding product`, data);
      throw err;
    }
  }

  async updateProduct(data: Product) {
    try {
      const product = await this.db
        .update(products)
        .set({
          name: data.name,
          price: data.price,
        })
        .where(eq(products.id, data.id));
      return product;
    } catch (err) {
      console.log('Error updating product', data);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.db.delete(products).where(eq(products.id, id));
    } catch (err) {
      console.log('Error delete product', id);
    }
  }

  async getProductsByIds(data: any) {
    try {
      const ids = data.map((d) => d.id);
      const productsData = await this.db.query.products.findMany({
        where: inArray(products.id, ids),
      });
      return productsData;
    } catch (error) {
      console.error('Error fetching products by ids:', error);
      throw error;
    }
  }
}
