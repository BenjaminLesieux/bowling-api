import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { Product } from '@app/shared/database/schemas/schemas';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get-products')
  async getProducts(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    return await this.productService.getProducts('');
  }

  @MessagePattern('get-product-by-id')
  async getProductById(id: string) {
    return await this.productService.getProductById(id);
  }

  @MessagePattern('add-product')
  async addProduct(@Payload() data: Omit<Product, 'id'>, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`)
    return await this.productService.addProduct(data)
  }
}
