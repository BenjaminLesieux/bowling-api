import { Body, Controller, Post } from '@nestjs/common';
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
}
