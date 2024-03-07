import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../database/schemas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({
    cmd: 'create-user',
  })
  async createUser(@Payload() data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }

  @MessagePattern({
    cmd: 'get-user-by',
  })
  async getUserBy(@Payload() data: Partial<Omit<User, 'password'>>) {
    return await this.usersService.getBy(data);
  }
}
