import { NestFactory } from '@nestjs/core';
import { BowlingMainModule } from './bowling-main.module';

import { Logger } from '@nestjs/common';
import { MicroservicesService } from '@app/shared/infrastructure/transport/microservices.service';

export const logger = new Logger('BowlingMainMicroservice');

async function bootstrap() {
  const app = await NestFactory.create(BowlingMainModule);
  const rmqService = app.get<MicroservicesService>(MicroservicesService);
  app.connectMicroservice(rmqService.getOptions('MAIN', true));
  await app.startAllMicroservices();
}
bootstrap().then(() => {
  logger.log('Bowling Main Microservice is running');
});
