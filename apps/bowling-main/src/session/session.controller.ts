import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddSessionPayloadDto } from './dto/add-session-payload.dto';
import { GetBySessionPayloadDto } from './dto/get-by-session-payload.dto';
import { User } from '@app/shared/adapters/user.type';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @MessagePattern({ cmd: 'add-session' })
  async createSession(@Payload() data: AddSessionPayloadDto) {
    return await this.sessionService.addSession(data);
  }

  @MessagePattern({ cmd: 'terminate-session' })
  async terminateSession(@Payload() payload: { id: string; user: User }) {
    return await this.sessionService.terminateSession(payload);
  }

  @MessagePattern({ cmd: 'get-session-by' })
  async getBy(@Payload() data: GetBySessionPayloadDto) {
    return await this.sessionService.getBy(data);
  }
}
