import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { OnSessionCreate } from '@app/shared/infrastructure/transport/events/session-events';
import OrderCommands from '@app/shared/infrastructure/transport/commands/OrderCommands';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(OnSessionCreate)
  async onSessionCreate(@Payload() data: { sessionId: string; userId: string }) {
    return await this.orderService.createOrder(data.sessionId, data.userId);
  }

  @MessagePattern(OrderCommands.GET_ORDERS)
  async getOrders(data: GetOrdersDto) {
    return await this.orderService.getOrders(data);
  }
}
