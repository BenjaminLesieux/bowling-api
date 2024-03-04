import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BowlingAlleysService } from './bowling-alleys.service';
import { CreateAlleyDto } from './dto/bowling-alleys.dto';
import { JwtAuthGuard } from '@app/shared';

@ApiTags('bowling-alleys')
@Controller('bowling-alleys')
export class BowlingAlleysController {
  constructor(private readonly bowlingAlleyService: BowlingAlleysService) {}

  @Post()
  async addLane(@Body() data: CreateAlleyDto) {
    return this.bowlingAlleyService.createAlley(data);
  }

  @Get(':alleyId')
  async getLane(@Param('alleyId') alleyId: string) {
    return this.bowlingAlleyService.getBowlingAlleyBy({
      id: alleyId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'parkId', required: false })
  @ApiQuery({ name: 'laneNumber', required: false })
  async getLanes(
    @Param('parkId') parkId?: string,
    @Query('laneNumber') laneNumber?: number,
  ) {
    return this.bowlingAlleyService.getBowlingAlleyBy({
      bowlingParkId: parkId,
      laneNumber,
    });
  }
}
