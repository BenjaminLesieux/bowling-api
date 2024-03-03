import { NestFactory } from '@nestjs/core';
import { BowlingAuthModule } from './bowling-auth.module';
import { MicroservicesService } from '@app/shared/microservices/microservices.service';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

patchNestJsSwagger();

const logger = new Logger('BowlingAuth');

async function bootstrap() {
  const app = await NestFactory.create(BowlingAuthModule);
  const microservicesService =
    app.get<MicroservicesService>(MicroservicesService);
  const microserviceOptions = microservicesService.getOptions('AUTH', true);
  app.connectMicroservice<MicroserviceOptions>(microserviceOptions);
  app.useGlobalPipes(new ZodValidationPipe());
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Bowling API')
    .setDescription('The Bowling API description')
    .setVersion('1.0')
    .addTag('bowling')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

bootstrap().then(() => {
  logger.log('Bowling Auth Microservice is running');
});
