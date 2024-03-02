import { NestFactory } from '@nestjs/core';
import { BowlingPaymentModule } from './bowling-payment.module';

async function bootstrap() {
  const app = await NestFactory.create(BowlingPaymentModule);
  await app.listen(3000);
}
bootstrap();
