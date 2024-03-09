import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BowlingParkDto, SearchParkDto, UpdateParkDto } from './dto/bowling-park.dto';
import { BowlingParksService } from './bowling-parks.service';
import BowlingParkCommands from '@app/shared/infrastructure/transport/commands/BowlingParkCommands';

@Controller('bowling-parks')
export class BowlingParksController {
  constructor(private readonly bowlingParksService: BowlingParksService) {}

  @MessagePattern(BowlingParkCommands.GET_BOWLING_PARKS)
  async getBowlingParks() {
    return this.bowlingParksService.getBowlingParks();
  }

  @MessagePattern(BowlingParkCommands.GET_BOWLING_PARK_BY)
  async getBowlingParkBy(search: SearchParkDto) {
    return this.bowlingParksService.getBowlingParkBy(search);
  }

  @MessagePattern(BowlingParkCommands.CREATE_BOWLING_PARK)
  async createBowlingPark(data: BowlingParkDto) {
    return this.bowlingParksService.createBowlingPark(data);
  }

  @MessagePattern(BowlingParkCommands.UPDATE_BOWLING_PARK)
  async updateBowlingPark(data: UpdateParkDto) {
    return this.bowlingParksService.updateBowlingPark(data);
  }

  @MessagePattern(BowlingParkCommands.DELETE_BOWLING_PARK)
  async deleteBowlingPark(id: string) {
    return this.bowlingParksService.deleteBowlingPark(id);
  }

  @MessagePattern(BowlingParkCommands.GET_PRODUCTS_BY_BOWLING_PARK)
  async getProductsByBowlingPark(@Payload() data: { id: string }) {
    return await this.bowlingParksService.getProductsByBowlingPark(data.id);
  }

  @MessagePattern(BowlingParkCommands.ADD_PRODUCT_TO_CATALOG)
  async addProductToCatalog(@Payload() data: { id: string; productId: string }) {
    return await this.bowlingParksService.addProductToCatalog(data.id, data.productId);
  }
}
