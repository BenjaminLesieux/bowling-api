import { NestFactory } from '@nestjs/core';
import { BowlingPaymentModule } from './bowling-payment.module';

import { MicroservicesService } from '@app/shared/microservices/microservices.service';
import { Logger } from '@nestjs/common';

export const logger = new Logger('BowlingPaymentMicroservice');

async function bootstrap() {
  const app = await NestFactory.create(BowlingPaymentModule);
  const rmqService = app.get<MicroservicesService>(MicroservicesService);
  app.connectMicroservice(rmqService.getOptions('PAYMENT', true));
  await app.startAllMicroservices();
}
bootstrap().then(() => {
  logger.log('Bowling Payment service is running');
});
