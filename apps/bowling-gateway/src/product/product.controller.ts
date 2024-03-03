import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchProductDto } from './dto/searchProductDto';
import { AddProductDto } from './dto/addProductDto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/search')
  async search(@Body() body: SearchProductDto) {
    console.log('search', body);
    return await this.productService.search(body, '');
  }

  @Post('/add')
  async add(@Body() body: AddProductDto) {
    console.log('add', body)
    return await this.productService.add(body)
  }
}
