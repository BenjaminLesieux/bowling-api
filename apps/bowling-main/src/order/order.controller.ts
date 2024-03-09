import { Param, Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AddProductDto } from './dto/addProductDto';
import { ApiTags } from '@nestjs/swagger';
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
