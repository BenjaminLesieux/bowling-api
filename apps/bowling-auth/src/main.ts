import { NestFactory } from '@nestjs/core';
import { BowlingAuthModule } from './bowling-auth.module';
import { MicroservicesService } from '@app/shared/microservices/microservices.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BowlingAuthModule);
  const microservicesService =
    app.get<MicroservicesService>(MicroservicesService);
  app.connectMicroservice<MicroserviceOptions>(
    microservicesService.getOptions('AUTH', true),
  );
  app.useGlobalPipes(new ZodValidationPipe());
  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap().then(() => {
  console.log('Bowling Auth Microservice is running');
});
