import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
