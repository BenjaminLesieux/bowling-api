import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckoutDto } from './dto/createCheckoutDto';
import { JwtAuthGuard } from '@app/shared';
import { OrderService } from './order.service';
import { AddProductDto } from './dto/addProductDto';
import { User } from '@app/shared/database/schemas/schemas';
import { ReqUser } from '@app/shared/authentication/user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: CreateCheckoutDto, @ReqUser() user: User) {
    return await this.orderService.checkout(body, user);
  }

  // route to add products to order
  @UseGuards(JwtAuthGuard)
  @Post('/products')
  async addProduct(@Body() body: AddProductDto, @ReqUser() user: User) {
    console.log(user);
    return await this.orderService.addProduct(body, user);
  }
}
