import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchProductDto } from './dto/searchProductDto';
import { ApiTags } from '@nestjs/swagger';
import { AddProductDto } from './dto/addProductDto';
import { JwtAuthGuard } from '@app/shared';
import { UpdateProductDto } from './dto/updateProductDto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/search')
  async search(@Body() body: SearchProductDto) {
    console.log('search', body);
    return await this.productService.search(body);
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    console.log('search', id);
    return await this.productService.get(id);
  }

  @Post()
  async add(@Body() body: AddProductDto) {
    console.log('add', body);
    return await this.productService.add(body);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    console.log('update', body);
    return await this.productService.update(id, body);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    console.log('delete', id);
    return await this.productService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: any) {
    console.log('checkout', body);
    return await this.productService.checkout(body);
  }
}
