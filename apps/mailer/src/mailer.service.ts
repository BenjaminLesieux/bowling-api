import { Injectable } from '@nestjs/common';
import { EmailDto } from 'apps/bowling-gateway/src/email/dto/email.dto';
import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'super.cool.efrei@gmail.com',
    pass: 'u#F7oE9MVL4pd%qy'
  }
});

@Injectable()
export class MailService {

  constructor() {};

  getHello(): string {
    return 'Hello World!';
  }

  sendEmail(email: EmailDto) {
    const mailOptions = {
      from: 'super.cool.efrei@gmail.com',
      to: email.to,
      subject: email.subject,
      text: email.text
    };
    transporter.sendEmail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
  }
}
