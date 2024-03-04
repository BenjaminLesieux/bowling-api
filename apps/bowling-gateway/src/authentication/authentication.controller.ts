import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { AuthenticationService } from './authentication.service';
import { User } from '@app/shared/database/schemas/schemas';
import { JwtAuthGuard } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@app/shared/authentication/user.decorator';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto, @Req() req) {
    return this.authService.register(user);
  }

  @Post('/login')
  async login(@Body() user: LogUserDto, @Res({ passthrough: true }) response) {
    await this.authService.login(user, response);
    response.json({
      ok: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@ReqUser() user: User) {
    await this.authService.getMe();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response) {
    await this.authService.logout(response);
    response.json({
      ok: true,
    });
  }
}
