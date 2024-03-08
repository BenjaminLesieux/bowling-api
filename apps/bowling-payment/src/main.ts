import { NestFactory } from '@nestjs/core';
import { BowlingPaymentModule } from './bowling-payment.module';

import { MicroservicesService } from '@app/shared/transport/transport.service';
import { Logger } from '@nestjs/common';
import { PAYMENT_MICROSERVICE } from '@app/shared/services';

export const logger = new Logger('BowlingPaymentMicroservice');

async function bootstrap() {
  const app = await NestFactory.create(BowlingPaymentModule);
  const rmqService = app.get<MicroservicesService>(MicroservicesService);
  app.connectMicroservice(rmqService.getOptions(PAYMENT_MICROSERVICE, true));
  await app.startAllMicroservices();
}
bootstrap().then(() => {
  logger.log('Bowling Payment service is running');
});
