import { NestFactory } from '@nestjs/core';
import { BowlingMainModule } from './bowling-main.module';

import { MicroservicesService } from '@app/shared/microservices/microservices.service';

async function bootstrap() {
  const app = await NestFactory.create(BowlingMainModule);
  const rmqService = app.get<MicroservicesService>(MicroservicesService);
  app.connectMicroservice(rmqService.getOptions('MAIN'));
  await app.startAllMicroservices();
}
bootstrap();
