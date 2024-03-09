import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alley.dto';
import { BowlingAlleysService } from './bowling-alleys.service';
import BowlingAlleyCommands from '@app/shared/infrastructure/transport/commands/BowlingAlleyCommands';

@Controller('bowling-alleys')
export class BowlingAlleysController {
  constructor(private readonly bowlingAlleysService: BowlingAlleysService) {}

  @MessagePattern(BowlingAlleyCommands.ADD_BOWLING_ALLEY)
  async addBowlingAlley(@Payload() data: CreateAlleyDto) {
    return this.bowlingAlleysService.addBowlingAlley(data);
  }

  @MessagePattern(BowlingAlleyCommands.DELETE_BOWLING_ALLEY)
  async deleteBowlingAlley(@Payload() id: string) {
    return this.bowlingAlleysService.deleteBowlingAlley(id);
  }

  @MessagePattern(BowlingAlleyCommands.GET_BOWLING_ALLEYS)
  async getBowlingAlleys() {
    return this.bowlingAlleysService.getBowlingAlleys();
  }

  @MessagePattern(BowlingAlleyCommands.GET_BOWLING_ALLEY_BY)
  async getBowlingAlleyBy(@Payload() search: SearchAlleyDto) {
    return this.bowlingAlleysService.getBowlingAlleyBy(search);
  }

  @MessagePattern(BowlingAlleyCommands.GET_QR_CODE)
  async getQrCode(@Payload() id: string) {
    return this.bowlingAlleysService.getQrCode(id);
  }

  @MessagePattern(BowlingAlleyCommands.GET_CATALOG_OF_ID)
  async getCatalogOfId(@Payload() id: string) {
    return this.bowlingAlleysService.getCatalogOfId(id);
  }
}
