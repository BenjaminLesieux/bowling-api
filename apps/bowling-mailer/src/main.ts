import { NestFactory } from '@nestjs/core';
import { BowlingMailerModule } from './bowling-mailer.module';

async function bootstrap() {
  const app = await NestFactory.create(BowlingMailerModule);
  await app.listen(3000);
}
bootstrap();
