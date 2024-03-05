import { RpcError } from '@app/shared/rpc-error';
import { Injectable } from '@nestjs/common';
import { EmailDto } from 'apps/bowling-gateway/src/email/dto/email.dto';
import { createTransport } from 'nodemailer';

@Injectable()
export class BowlingMailerService {
  
  private transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'super.cool.efrei@gmail.com',
      pass: 'u#F7oE9MVL4pd%qy',
    },
  });
  
  constructor() {}

  sendEmail(email: EmailDto) {
    console.log(email)
    const mailOptions = {
      from: 'super.cool.efrei@gmail.com',
      to: email.to,
      subject: email.subject,
      text: email.text,
    };
    this.transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        throw new RpcError({ message: 'Error sending email', status: 500});
      } else {
        console.log(info);
      }
    });
  }
}
