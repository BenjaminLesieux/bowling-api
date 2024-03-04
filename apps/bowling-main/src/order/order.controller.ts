import { Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get-order-by-id' })
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getById(id);
  }

  @MessagePattern({ cmd: 'checkout' })
  async checkout(@Payload() payload: { orderId: string; amountToPay: number }) {
    return await this.orderService.checkout(payload);
  }
}
