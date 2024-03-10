import { Param, Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AddProductDto } from './dto/addProductDto';
import { ApiTags } from '@nestjs/swagger';
import { GetOrdersDto } from './dto/get-orders.dto';
import { OnSessionCreate } from '@app/shared/infrastructure/transport/events/session-events';
import OrderCommands from '@app/shared/infrastructure/transport/commands/OrderCommands';
import Stripe from 'stripe';

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

  @MessagePattern(OrderCommands.GET_ORDER_BY_ID)
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getById(id);
  }

  @MessagePattern(OrderCommands.CHECKOUT)
  async checkout(@Payload() payload: { orderId: string; amountToPay: number; userId: string }) {
    return await this.orderService.checkout(payload);
  }

  @MessagePattern(OrderCommands.ADD_PRODUCT_TO_ORDER)
  async addProduct(@Payload() payload: AddProductDto) {
    console.log('receveid', payload);
    return await this.orderService.addProductToOrder(payload);
  }

  @MessagePattern(OrderCommands.UPDATE_ON_CHECKOUT_COMPLETE)
  async updateOnCheckoutComplete(@Payload() payload: Stripe.CheckoutSessionCompletedEvent) {
    return await this.orderService.updateOnCheckoutComplete(payload);
  }
  @MessagePattern(OrderCommands.UPDATE_ON_CHECKOUT_EXPIRED)
  async updateOnCheckoutExpired(@Payload() payload: Stripe.CheckoutSessionCompletedEvent) {
    return await this.orderService.updateOnCheckoutExpired(payload);
  }
}
