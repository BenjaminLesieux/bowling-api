import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern({ cmd: 'on-session-create' })
  async onSessionCreate(@Payload() data: { id: string; userId: string }) {
    console.log(data);
    return await this.orderService.createOrder(data.id, data.userId);
  }
}
