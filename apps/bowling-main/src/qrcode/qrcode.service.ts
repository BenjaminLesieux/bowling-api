import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode'

@Injectable()
export class QrcodeService {
  async qrcode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data);
    } catch (e) {
      console.error('Error while generating QR code', e);
      return '';
    }
  }
}