import { Inject, Injectable } from "@nestjs/common";
import { EmailDto } from "./dto/email.dto";
import { MAILER_MICROSERVICE } from "@app/shared/services";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class EmailService {
  constructor(@Inject(MAILER_MICROSERVICE) private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendEmail(email: EmailDto) {
    return await lastValueFrom(this.client.send({ cmd: 'send-email' }, email));
  }
}