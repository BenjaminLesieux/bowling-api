import { Controller, Logger, UseGuards } from '@nestjs/common';
import { BowlingAuthService } from './bowling-auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '@app/shared/database/schemas/schemas';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BowlingAuthController {
  constructor(private readonly bowlingAuthService: BowlingAuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({
    cmd: 'login',
  })
  async loginMicroservice(@CurrentUser() user: User) {
    Logger.log('Received login request from microservice');
    return await this.bowlingAuthService.loginMicroservice(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({
    cmd: 'validate-user',
  })
  async validateUser(@CurrentUser() user: User) {
    console.log(user);
    return {
      ...user,
      password: undefined,
    };
  }
}
