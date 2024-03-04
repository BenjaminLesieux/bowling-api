import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BowlingParksService } from './bowling-parks.service';
import { CreateParkDto, UpdateParkDto } from './dto/bowling-parks.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('bowling-parks')
@Controller('bowling-parks')
export class BowlingParksController {
  constructor(private readonly bowlingParksService: BowlingParksService) {}

  @Post()
  async createBowlingPark(@Body() data: CreateParkDto) {
    return this.bowlingParksService.createPark(data);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async findAll(@Query('name') name?: string, @Query('limit') limit?: number, @Query('page') page?: number) {
    if (name || limit || page) {
      return this.bowlingParksService.getBowlingParkBy({ name, limit, page });
    }

    return this.bowlingParksService.getBowlingParks();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bowlingParksService.getBowlingParkBy({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateParkDto: UpdateParkDto) {
    return this.bowlingParksService.updateBowlingPark(id, updateParkDto);
  }
}
