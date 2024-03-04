import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckoutDto } from './dto/createCheckoutDto';
import { JwtAuthGuard } from '@app/shared';
import { OrderService } from './order.service';

@ApiTags('products')
@Controller('products')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: CreateCheckoutDto) {
    return await this.orderService.checkout(body);
  }
}
