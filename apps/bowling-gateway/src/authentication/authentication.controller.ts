import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto, @Req() request) {
    return this.authService.register(user);
  }

  @Post('/login')
  async login(@Body() user: LogUserDto, @Req() request) {
    return this.authService.login(user);
  }
}
