import { Body, Controller, Post, UseGuards, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckoutDto } from './dto/createCheckoutDto';
import { JwtAuthGuard } from '@app/shared';
import { OrderService } from './order.service';
import { AddProductDto } from './dto/addProductDto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: CreateCheckoutDto) {
    return await this.orderService.checkout(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async addProduct(@Param('id') id: string, @Body() body: AddProductDto) {
    return await this.orderService.addProduct(body);
  }
}
