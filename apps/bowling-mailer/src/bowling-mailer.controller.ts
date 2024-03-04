import { Controller } from '@nestjs/common';
import { BowlingMailerService } from './bowling-mailer.service';
import { MessagePattern } from '@nestjs/microservices';
import { EmailDto } from 'apps/bowling-gateway/src/email/dto/email.dto';

@Controller()
export class BowlingMailerController {
  constructor(private readonly mailService: BowlingMailerService) {}

  @MessagePattern({
    cmd: 'send-email',
  })
  async sendEmail(data: EmailDto) {
    console.log('Sending email: ', data.subject);
    return this.mailService.sendEmail(data);
  }
}
