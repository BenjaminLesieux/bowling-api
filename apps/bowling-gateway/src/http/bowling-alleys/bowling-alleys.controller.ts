import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BowlingAlleysService } from './bowling-alleys.service';
import { CreateAlleyDto } from './dto/bowling-alleys.dto';
import { JwtAuthGuard } from '@app/shared';

@ApiTags('bowling-alleys')
@Controller('bowling-alleys')
export class BowlingAlleysController {
  constructor(private readonly bowlingAlleyService: BowlingAlleysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addLane(@Body() data: CreateAlleyDto) {
    return this.bowlingAlleyService.createAlley(data);
  }

  @UseGuards(JwtAuthGuard)
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
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getLanes(@Param('parkId') parkId?: string, @Query('laneNumber') laneNumber?: number, @Query('limit') limit?: number, @Query('page') page?: number) {
    return this.bowlingAlleyService.getBowlingAlleyBy({
      bowlingParkId: parkId,
      laneNumber,
      limit,
      page,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':alleyId/qrCode')
  async getQrCode(@Param('alleyId') alleyId: string) {
    return this.bowlingAlleyService.getQrCode(alleyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('catalog')
  @ApiQuery({ name: 'qrCode', required: true })
  async getCatalog(@Query('qrCode') qrCode: string) {
    return this.bowlingAlleyService.getCatalogOfId(qrCode);
  }
}
