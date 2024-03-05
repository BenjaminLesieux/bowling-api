import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddSessionDto } from 'apps/bowling-gateway/src/session/dto/addSessionDto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @MessagePattern({ cmd: 'add-session' })
  async createSession(@Payload() data: AddSessionDto) {
    return await this.sessionService.addSession(data);
  }
}
