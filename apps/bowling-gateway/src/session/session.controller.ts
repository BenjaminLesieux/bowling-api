import { Body, Controller, Param, Post } from '@nestjs/common';
import { AddSessionDto } from './dto/addSessionDto';
import { SessionService } from './session.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(@Body() body: AddSessionDto) {
    console.log('add session', body);
    return await this.sessionService.add(body);
  }

  @Post('/terminate/:id')
  async terminateSession(@Param('id') id: string) {
    console.log('terminate session', id);
    return await this.sessionService.terminate(id);
  }
}
