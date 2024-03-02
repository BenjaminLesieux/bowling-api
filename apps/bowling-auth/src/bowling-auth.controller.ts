import { Controller, Post, Res, UseGuards } from '@nestjs/common';
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
  @Post('/login')
  async login(@CurrentUser() user: User, @Res({ passthrough: true }) response) {
    this.bowlingAuthService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate-user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
