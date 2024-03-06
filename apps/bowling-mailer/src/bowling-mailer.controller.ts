import { Controller } from '@nestjs/common';
import { BowlingMailerService } from './bowling-mailer.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EmailDto } from './dto/email.dto';
import { User } from '@app/shared/adapters/user.type';
import { SessionClosedEmailDto } from './dto/session-closed-email.dto';
import { logger } from './main';

@Controller()
export class BowlingMailerController {
  constructor(private readonly mailService: BowlingMailerService) {}

  @MessagePattern({
    cmd: 'send-email',
  })
  sendEmail(data: EmailDto) {
    return this.mailService.sendEmail(data);
  }

  @EventPattern({
    cmd: 'on-session-closed',
  })
  sendSessionClosedEmail(@Payload() data: { user: User; infoData: SessionClosedEmailDto }) {
    logger.log('session closing');
    return this.mailService.sendEmail({
      to: data.user.email,
      subject: 'Session Closed',
      text: `Hello ${data.user.email}, your session ${data.infoData.parkName} on lane ${data.infoData.laneNumber} has been closed.`,
    });
  }

  @EventPattern({
    cmd: 'on-user-register',
  })
  sendRegisterEmail(@Payload() user: User) {
    return this.mailService.sendEmail({
      to: user.email,
      subject: 'Welcome to Bowling!',
      text: `Hello ${user.email}, welcome to our bowling ! Don't forget to login :D`,
    });
  }
}
