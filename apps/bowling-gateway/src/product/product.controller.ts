import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchProductDto } from './dto/searchProductDto';
import { AddProductDto } from './dto/addProductDto';
import { JwtAuthGuard } from '@app/shared';
import { UpdateProductDto } from './dto/updateProductDto';
import { DeleteProductDto } from './dto/deleteProductDto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/search')
  async search(@Body() body: SearchProductDto) {
    console.log('search', body);
    return await this.productService.search(body);
  }

  @Post('')
  async add(@Body() body: AddProductDto) {
    console.log('add', body);
    return await this.productService.add(body);
  }

  @Patch('')
  async update(@Body() body: UpdateProductDto) {
    console.log('update', body);
    const { name, ...newData } = body;
    return await this.productService.update(name, newData);
  }

  @Delete('')
  async deleteProduct(@Body() body: DeleteProductDto) {
    console.log('delete', body);
    return await this.productService.deleteProduct(body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: any) {
    console.log('checkout', body);
    return await this.productService.checkout(body);
  }
}
