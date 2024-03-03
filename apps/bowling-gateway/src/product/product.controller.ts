import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchProductDto } from './dto/searchProductDto';
import { AddProductDto } from './dto/addProductDto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/search')
  async search(@Body() body: SearchProductDto) {
    console.log('search', body);
    return await this.productService.search(body);
  }

  @Post('/add')
  async add(@Body() body: AddProductDto) {
    console.log('add', body);
    return await this.productService.add(body);
  }

  @Post('/update/:name')
  async update(@Body() body: AddProductDto, @Param('name') name: string) {
    console.log('update', body);
    return await this.productService.update(name, body);
  }

  @Delete('/:name')
  async deleteProduct(@Param('name') name: string) {
    console.log('delete', name);
    return await this.productService.deleteProduct(name);
  }

  @Post('/checkout')
  async checkout(@Body() body: any) {
    console.log('checkout', body);
    return await this.productService.checkout(body);
  }
}
