import { Controller, Get, Query, Post, UseGuards, Body } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@app/shared/adapters/user.type';
import { OrdersService } from './orders.service';
import { Roles, UserRole } from '@app/shared';
import { ReqUser } from '@app/shared/infrastructure/utils/decorators/user.decorator';

import { CreateCheckoutDto } from './dto/createCheckoutDto';
import { JwtAuthGuard } from '@app/shared';
import { AddProductDto } from './dto/addProductDto';

@ApiTags('orders')
@Controller('orders')
@Roles(UserRole.ADMIN)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
  })
  async getOrders(@ReqUser() user: User, @Query('limit') limit?: number, @Query('page') page?: number, @Query('userId') userId?: string) {
    let uId = user.id;

    if (userId) {
      uId = userId;
    }

    return this.ordersService.getBy({
      userId: uId,
      limit,
      page,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/checkout')
  async checkout(@Body() body: CreateCheckoutDto, @ReqUser() user: User) {
    return await this.ordersService.checkout(body, user);
  }

  // route to add products to order
  @UseGuards(JwtAuthGuard)
  @Post('/products')
  async addProduct(@Body() body: AddProductDto, @ReqUser() user: User) {
    console.log(user);
    return await this.ordersService.addProduct(body, user);
  }
}
