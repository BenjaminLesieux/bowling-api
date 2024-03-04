import { Controller, Get } from '@nestjs/common';
import { BowlingMainService } from './bowling-main.service';
import { MessagePattern } from '@nestjs/microservices';
import { QrcodeService } from './qrcode/qrcode.service';

@Controller()
export class BowlingMainController {
  constructor(
    private readonly bowlingMainService: BowlingMainService,
    private readonly qrCodeService: QrcodeService,  
  ) {}

  @MessagePattern({
    cmd: 'hello',
  })
  getHello(): string {
    return this.bowlingMainService.getHello();
  }

  @MessagePattern({
    cmd: 'qr',
  })
  async getQr(data: string) {
    return await this.qrCodeService.qrcode(data);
  }
}
