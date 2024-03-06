import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { GetOrdersDto } from './dto/get-orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern({ cmd: 'on-session-create' })
  async onSessionCreate(@Payload() data: { sessionId: string; userId: string }) {
    return await this.orderService.createOrder(data.sessionId, data.userId);
  }

  @MessagePattern({
    cmd: 'get-orders',
  })
  async getOrders(data: GetOrdersDto) {
    return await this.orderService.getOrders(data);
  }
}
