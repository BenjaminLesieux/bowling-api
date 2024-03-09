import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { Product } from '../database/schemas';
import ProductCommands from '@app/shared/infrastructure/transport/commands/ProductCommands';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(ProductCommands.SEARCH_PRODUCTS)
  async getProducts() {
    return this.productService.getProducts();
  }

  @MessagePattern(ProductCommands.GET_PRODUCTS_BY_IDS)
  async getProductsByIds(
    @Payload()
    data: any,
  ) {
    return this.productService.getProductsByIds(data.products);
  }

  @MessagePattern(ProductCommands.GET_PRODUCTS_BY_ID)
  async getProductById(id: string) {
    return await this.productService.getProductById(id);
  }

  @MessagePattern(ProductCommands.ADD_PRODUCT)
  async addProduct(@Payload() data: Omit<Product, 'id'>) {
    return await this.productService.addProduct(data);
  }

  @MessagePattern(ProductCommands.UPDATE_PRODUCT)
  async updateProduct(@Payload() data: Product, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    return await this.productService.updateProduct(data);
  }

  @MessagePattern(ProductCommands.DELETE_PRODUCT)
  async deleteProduct(@Payload() data: { id: string }) {
    return await this.productService.deleteProduct(data.id);
  }
}
