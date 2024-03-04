import { Controller } from '@nestjs/common';
import { MailService } from './mailer.service';
import { MessagePattern } from '@nestjs/microservices';
import { EmailDto } from 'apps/bowling-gateway/src/email/dto/email.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern({
    cmd: 'send-email',
  })
  async sendEmail(data: EmailDto) {
    return this.mailService.sendEmail(data);
  }
}
