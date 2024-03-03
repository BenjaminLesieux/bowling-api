import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from '../../../bowling-auth/src/current-user.decorator';
import { User } from '@app/shared/database/schemas/schemas';
import { JwtAuthGuard } from '@app/shared';

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
  async getMe(@CurrentUser() user: User) {
    await this.authService.getMe();
  }
}
