import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddSessionPayloadDto } from './dto/add-session-payload.dto';
import { GetBySessionPayloadDto } from './dto/get-by-session-payload.dto';
import { User } from '@app/shared/adapters/user.type';
import SessionCommands from '@app/shared/infrastructure/transport/commands/SessionCommands';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  @MessagePattern(SessionCommands.ADD_SESSION)
  async createSession(@Payload() data: AddSessionPayloadDto) {
    return await this.sessionService.addSession(data);
  }

  @MessagePattern(SessionCommands.TERMINATE_SESSION)
  async terminateSession(@Payload() payload: { id: string; user: User }) {
    return await this.sessionService.terminateSession(payload);
  }

  @MessagePattern(SessionCommands.GET_SESSION_BY)
  async getBy(@Payload() data: GetBySessionPayloadDto) {
    return await this.sessionService.getBy(data);
  }
}
