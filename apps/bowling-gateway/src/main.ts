import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { patchNestJsSwagger } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { raw } from 'body-parser';
import { RpcErrorsInterceptor } from '@app/shared/rpc-errors.interceptor';

patchNestJsSwagger();

export const logger = new Logger('BowlingGateway');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // webhook get rawBody
  app.use('/stripe/webhook', raw({ type: 'application/json' }));

  const config = new DocumentBuilder().setTitle('Bowling API').setDescription('The Bowling API description').setVersion('1.0').addTag('bowling').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new RpcErrorsInterceptor());
  await app.listen(3000);
}
bootstrap().then(() => {
  logger.log('Gateway is running on http://localhost:3000/');
});
