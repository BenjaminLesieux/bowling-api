import { Module } from '@nestjs/common';
import { MailController } from './mailer.controller';
import { MailService } from './mailer.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService],
})
export class MailerModule {}
