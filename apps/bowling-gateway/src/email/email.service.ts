import { Inject, Injectable } from "@nestjs/common";
import { EmailDto } from "./dto/email.dto";
import { lastValueFrom } from "rxjs";
import { MAIN_MICROSERVICE } from "@app/shared/services";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class EmailService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendEmail(email: EmailDto) {
    console.log('sending')
    await lastValueFrom(this.client.send({ cmd: 'send-email' }, email));
    console.log('sent')
    return;
  }
}