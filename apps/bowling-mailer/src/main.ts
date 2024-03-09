import { NestFactory } from '@nestjs/core';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { BowlingMailerModule } from './bowling-mailer.module';
import { MicroservicesService } from '@app/shared/infrastructure/transport/microservices.service';
import { MAILER_MICROSERVICE } from '@app/shared';

patchNestJsSwagger();

export const logger = new Logger('BowlingMailer');

async function bootstrap() {
  const app = await NestFactory.create(BowlingMailerModule);
  const microservicesService = app.get<MicroservicesService>(MicroservicesService);
  const config = new DocumentBuilder().setTitle('Bowling API').setDescription('The Bowling API description').setVersion('1.0').addTag('bowling').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const microserviceOptions = microservicesService.getOptions(MAILER_MICROSERVICE, true);
  app.connectMicroservice<MicroserviceOptions>(microserviceOptions);
  app.useGlobalPipes(new ZodValidationPipe());
  console.log(app.get(ConfigService));
  await app.startAllMicroservices();
}

bootstrap().then(() => {
  logger.log('Bowling Mailer Microservice is running');
});
