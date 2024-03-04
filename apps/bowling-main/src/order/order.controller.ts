import { Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get-order-by-id' })
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getById(id);
  }
}
