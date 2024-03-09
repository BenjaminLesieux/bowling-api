import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { RpcError } from '@app/shared/infrastructure/utils/errors/rpc-error';

@Injectable()
export class QrcodeService {
  async qrcode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data);
    } catch (e) {
      throw new RpcError({
        status: 400,
        message: e.message,
      });
    }
  }
}
