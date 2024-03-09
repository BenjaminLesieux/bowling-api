import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@app/shared/adapters/user.type';
import { OrdersService } from './orders.service';
import { Roles, UserRole } from '@app/shared';
import { ReqUser } from '@app/shared/infrastructure/utils/decorators/user.decorator';

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
}
