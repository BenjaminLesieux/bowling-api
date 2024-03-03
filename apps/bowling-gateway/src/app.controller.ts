import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('/qr')
  async getQr() {
    // TODO: replace data with requested alley id
    const data = 'https://www.youtube.com/watch?v=I4hoJzPllDo' 
    return `<img src="${await this.appService.getQr(data)}">`;
  }
}
