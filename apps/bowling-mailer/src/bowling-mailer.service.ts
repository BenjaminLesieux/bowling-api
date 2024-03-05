import { RpcError } from '@app/shared/rpc-error';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { logger } from './main';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class BowlingMailerService {
  
  private transport: Transporter<SentMessageInfo>;
  
  constructor(private configService: ConfigService) {}

  async sendEmail(email: EmailDto) {
    const mailOptions = {
      to: email.to,
      from: 'BowlingAlley',
      subject: email.subject,
      html: `<p>${email.text}</p>`,
    }

    this.transport = createTransport({
      service: 'gmail',
      auth: {
        pass: this.configService.get('GMAIL_PASSWORD'),
        user: this.configService.get('GMAIL_USER'),
      },
    });

    try {
      await this.transport.sendMail(mailOptions);
      logger.log(`Email sent to ${email.to}`);
    } catch (error) {
      logger.error(`Error sending email to ${email.to}`);
      throw new RpcError({message: error.message, status: 500});
    };
  }
}
