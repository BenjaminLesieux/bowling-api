import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard, User } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@app/shared/infrastructure/utils/decorators/user.decorator';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  async login(@Body() user: LogUserDto, @Res({ passthrough: true }) response) {
    await this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@ReqUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response): Promise<void> {
    await this.authService.logout(response);
    response.json({
      ok: true,
    });
  }
}
