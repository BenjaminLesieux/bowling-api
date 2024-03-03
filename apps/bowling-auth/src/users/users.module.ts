import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/shared';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
