import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddSessionDto } from './dto/add-session.dto';
import { SessionService } from './session.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles, UserRole } from '@app/shared';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async createSession(@Body() body: AddSessionDto) {
    return await this.sessionService.add(body);
  }

  @Post('/terminate/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async terminateSession(@Param('id') id: string) {
    return await this.sessionService.terminate(id);
  }

  @Get()
  async getAllSessions() {
    return await this.sessionService.getAll();
  }

  @Get('/:id')
  async getSession(@Param('id') id: string) {
    return await this.sessionService.get(id);
  }
}
