import { Body, Controller, Post } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendEmail(@Body() data: EmailDto) {
    this.emailService.sendEmail(data);
    return 'Email sent';
  }
}
