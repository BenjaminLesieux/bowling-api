import { Controller, Logger, UseGuards } from '@nestjs/common';
import { BowlingAuthService } from './bowling-auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import AuthCommands from '@app/shared/infrastructure/transport/commands/AuthCommands';
import { User } from './database/schemas';
import { LogUserResponseDto } from './users/dto/log-user.response.dto';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller()
export class BowlingAuthController {
  constructor(private readonly bowlingAuthService: BowlingAuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern(AuthCommands.LOGIN)
  async loginMicroservice(@CurrentUser() user: User): Promise<LogUserResponseDto> {
    Logger.log('Received login request from microservice');
    return await this.bowlingAuthService.loginMicroservice(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(AuthCommands.VALIDATE_USER)
  async validateUser(@CurrentUser() user: User): Promise<User> {
    console.log(user);
    return {
      ...user,
      password: undefined,
    };
  }
}
