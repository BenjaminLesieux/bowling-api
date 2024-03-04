import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateParkDto,
  SearchParkDto,
  UpdateParkDto,
} from './dto/create-park.dto';
import { CreateAlleyDto, SearchAlleyDto } from './dto/alley.dto';
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
  async createBowlingPark(data: CreateParkDto) {
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

  @MessagePattern({
    cmd: 'add-bowling-alley',
  })
  async addBowlingAlley(data: CreateAlleyDto) {
    return this.bowlingParksService.addBowlingAlley(data);
  }

  @MessagePattern({
    cmd: 'delete-bowling-alley',
  })
  async deleteBowlingAlley(id: string) {
    return this.bowlingParksService.deleteBowlingAlley(id);
  }

  @MessagePattern({
    cmd: 'get-bowling-alleys',
  })
  async getBowlingAlleys() {
    return this.bowlingParksService.getBowlingAlleys();
  }

  @MessagePattern({
    cmd: 'get-bowling-alley-by',
  })
  async getBowlingAlleyBy(search: SearchAlleyDto) {
    return this.bowlingParksService.getBowlingAlleyBy(search);
  }
}
