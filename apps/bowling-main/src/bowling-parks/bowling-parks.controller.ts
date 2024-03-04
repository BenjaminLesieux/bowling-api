import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BowlingParkDto, SearchParkDto, UpdateParkDto } from './dto/bowling-park.dto';
import { BowlingParksService } from './bowling-parks.service';

@Controller('bowling-parks')
export class BowlingParksController {
  constructor(private readonly bowlingParksService: BowlingParksService) {}

  @MessagePattern({
    cmd: 'get-bowling-parks',
  })
  async getBowlingParks() {
    return this.bowlingParksService.getBowlingParks();
  }

  @MessagePattern({
    cmd: 'get-bowling-park-by',
  })
  async getBowlingParkBy(search: SearchParkDto) {
    return this.bowlingParksService.getBowlingParkBy(search);
  }

  @MessagePattern({
    cmd: 'create-bowling-park',
  })
  async createBowlingPark(data: BowlingParkDto) {
    return this.bowlingParksService.createBowlingPark(data);
  }

  @MessagePattern({
    cmd: 'update-bowling-park',
  })
  async updateBowlingPark(data: UpdateParkDto) {
    return this.bowlingParksService.updateBowlingPark(data);
  }

  @MessagePattern({
    cmd: 'delete-bowling-park',
  })
  async deleteBowlingPark(id: string) {
    return this.bowlingParksService.deleteBowlingPark(id);
  }
}
