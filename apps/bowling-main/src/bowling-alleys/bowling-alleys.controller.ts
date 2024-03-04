import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alley.dto';
import { BowlingAlleysService } from './bowling-alleys.service';

@Controller('bowling-alleys')
export class BowlingAlleysController {
  constructor(private readonly bowlingAlleysService: BowlingAlleysService) {}

  @MessagePattern({
    cmd: 'add-bowling-alley',
  })
  async addBowlingAlley(data: CreateAlleyDto) {
    return this.bowlingAlleysService.addBowlingAlley(data);
  }

  @MessagePattern({
    cmd: 'delete-bowling-alley',
  })
  async deleteBowlingAlley(id: string) {
    return this.bowlingAlleysService.deleteBowlingAlley(id);
  }

  @MessagePattern({
    cmd: 'get-bowling-alleys',
  })
  async getBowlingAlleys() {
    return this.bowlingAlleysService.getBowlingAlleys();
  }

  @MessagePattern({
    cmd: 'get-bowling-alley-by',
  })
  async getBowlingAlleyBy(search: SearchAlleyDto) {
    return this.bowlingAlleysService.getBowlingAlleyBy(search);
  }

  @MessagePattern({
    cmd: 'get-qr-code',
  })
  async getQrCode(id: string) {
    return this.bowlingAlleysService.getQrCode(id);
  }
}
