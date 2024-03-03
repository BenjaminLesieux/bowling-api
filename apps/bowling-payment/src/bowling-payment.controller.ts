import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { BowlingPaymentService } from './bowling-payment.service';

@Controller()
export class BowlingPaymentController {
  constructor(private readonly bowlingPaymentService: BowlingPaymentService) {}

  @MessagePattern({
    cmd: 'create-checkout-session',
  })
  async create(): Promise<any> {
    const products = [
      {
        id: 1,
        name: 'Bowling Ball',
        price: 100,
        quantity: 2,
      },
      {
        id: 2,
        name: 'Bowling Shoes',
        price: 50,
        quantity: 3,
      },
      {
        id: 3,
        name: 'Bowling Pins',
        price: 10,
        quantity: 4,
      },
    ];
    const res = await this.bowlingPaymentService.createCheckoutSession(products);
    if (res.url) return res.url;
    throw new RpcException({
      message: 'Error creating checkout session',
      code: 500,
    });
  }
}
