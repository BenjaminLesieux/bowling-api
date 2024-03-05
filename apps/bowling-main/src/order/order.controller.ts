import { Param, Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AddProductDto } from './dto/addProductDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern({ cmd: 'on-session-create' })
  async onSessionCreate(@Payload() data: { id: string; userId: string }) {
    console.log(data);
    return await this.orderService.createOrder(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'get-order-by-id' })
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getById(id);
  }

  @MessagePattern({ cmd: 'checkout' })
  async checkout(@Payload() payload: { orderId: string; amountToPay: number; userId: string }) {
    return await this.orderService.checkout(payload);
  }

  @MessagePattern({ cmd: 'add-product-to-order' })
  async addProduct(@Payload() payload: AddProductDto) {
    console.log('receveid', payload);
    return await this.orderService.addProductToOrder(payload);
  }
}
