import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({
    cmd: 'create-user',
  })
  async createUser(@Payload() data: CreateUserDto, @Ctx() ctx: RmqContext) {
    return await this.usersService.createUser(data, ctx);
  }
}
