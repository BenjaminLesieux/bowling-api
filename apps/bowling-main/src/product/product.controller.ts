import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'get-products' })
  async getProducts(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    return await this.productService.getProducts('');
  }

  @MessagePattern('get-product-by-id')
  async getProductById(id: string) {
    return await this.productService.getProductById(id);
  }
}
