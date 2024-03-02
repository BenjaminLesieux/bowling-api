import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
})
export class UsersModule {}
