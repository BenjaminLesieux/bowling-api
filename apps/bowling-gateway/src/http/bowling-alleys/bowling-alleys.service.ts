import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alleys.dto';
import { Readable } from 'stream';
import { MAIN_MICROSERVICE } from '@app/shared';
import BowlingAlleyCommands from '@app/shared/infrastructure/transport/commands/BowlingAlleyCommands';

@Injectable()
export class BowlingAlleysService {
  constructor(@Inject(MAIN_MICROSERVICE) private readonly client: ClientProxy) {}

  async deleteBowlingAlley(id: string) {
    return await lastValueFrom(this.client.send(BowlingAlleyCommands.DELETE_BOWLING_ALLEY, id));
  }

  async createAlley(data: CreateAlleyDto) {
    return await lastValueFrom(this.client.send(BowlingAlleyCommands.ADD_BOWLING_ALLEY, data));
  }

  async getBowlingAlleyBy(search: SearchAlleyDto) {
    return await lastValueFrom(this.client.send(BowlingAlleyCommands.GET_BOWLING_ALLEY_BY, search));
  }

  async getBowlingAlleys() {
    return await lastValueFrom(this.client.send(BowlingAlleyCommands.GET_BOWLING_ALLEYS, {}));
  }

  async getQrCode(id: string) {
    const data = await lastValueFrom(this.client.send<string>(BowlingAlleyCommands.GET_QR_CODE, id));
    const formattedData = this.formatDataUrl(data);
    const fileBuffer = Buffer.from(formattedData, 'base64');
    const readable = Readable.from(fileBuffer);
    return new StreamableFile(readable, {
      type: 'image/png',
    });
  }

  getCatalogOfId(id: string) {
    return lastValueFrom(this.client.send(BowlingAlleyCommands.GET_CATALOG_OF_ID, id));
  }

  private formatDataUrl(data: string) {
    return data.replace('data:image/png;base64,', '');
  }
}
