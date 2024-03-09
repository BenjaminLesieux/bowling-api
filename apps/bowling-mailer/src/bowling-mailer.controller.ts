import { Controller } from '@nestjs/common';
import { BowlingMailerService } from './bowling-mailer.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EmailDto } from './dto/email.dto';
import { User } from '@app/shared/adapters/user.type';
import { SessionClosedEmailDto } from './dto/session-closed-email.dto';
import { OnUserRegister } from '@app/shared/infrastructure/transport/events/user-events';
import EmailCommands from '@app/shared/infrastructure/transport/commands/EmailCommands';
import { OnSessionClosed } from '@app/shared/infrastructure/transport/events/session-events';

@Controller()
export class BowlingMailerController {
  constructor(private readonly mailService: BowlingMailerService) {}

  @MessagePattern(EmailCommands.SEND_EMAIL)
  sendEmail(data: EmailDto) {
    return this.mailService.sendEmail(data);
  }

  @EventPattern(OnSessionClosed)
  sendSessionClosedEmail(@Payload() data: { user: User; infoData: SessionClosedEmailDto }) {
    return this.mailService.sendEmail({
      to: data.user.email,
      subject: 'Session Closed',
      text: `Hello ${data.user.email}, your session ${data.infoData.parkName} on lane ${data.infoData.laneNumber} has been closed.`,
    });
  }

  @EventPattern(OnUserRegister)
  sendRegisterEmail(@Payload() user: User) {
    return this.mailService.sendEmail({
      to: user.email,
      subject: 'Welcome to Bowling!',
      text: `Hello ${user.email}, welcome to our bowling ! Don't forget to login :D`,
    });
  }
}
