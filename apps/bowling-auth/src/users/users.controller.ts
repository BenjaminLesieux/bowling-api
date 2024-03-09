import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import AuthCommands from '@app/shared/infrastructure/transport/commands/AuthCommands';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(AuthCommands.CREATE_USER)
  async createUser(@Payload() data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }
}
