import { RpcError } from '@app/shared/rpc-error';
import { Injectable } from '@nestjs/common';
import { EmailDto } from 'apps/bowling-gateway/src/email/dto/email.dto';
import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { logger } from './main';

@Injectable()
export class BowlingMailerService {
  
  private oauthClient;
  private transport: Transporter<SentMessageInfo>;
  
  constructor(private configService: ConfigService) {
    this.oauthClient = new google.auth.OAuth2(
      this.configService.get('GMAIL_CLIENT_ID'),
      this.configService.get('GMAIL_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );
    this.oauthClient.setCredentials({
      refresh_token: this.configService.get('GMAIL_REFRESH_TOKEN'),
    });
  }

  async sendEmail(email: EmailDto) {
    const accessToken = await this.oauthClient.getAccessToken();

    const mailOptions = {
      to: email.to,
      from: 'Welcome BowlingAlley',
      subject: email.subject,
      html: `<p>${email.text}</p>`,
    }

    this.transport = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('GMAIL_USER'),
        clientId: this.configService.get('GMAIL_CLIENT_ID'),
        clientSecret: this.configService.get('GMAIL_CLIENT_SECRET'),
        refreshToken: this.configService.get('GMAIL_REFRESH_TOKEN'),
        accessToken,
      },
    });
    console.log(accessToken)
    console.log(mailOptions);
    console.log(this.transport);

    try {
      await this.transport.sendMail(mailOptions);
      logger.log(`Email sent to ${email.to}`);
    } catch (error) {
      logger.error(`Error sending email to ${email.to}`);
      throw new RpcError({message: error.message, status: 500});
    };
  }
}
