import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BowlingParksService } from './bowling-parks.service';
import { CreateParkDto, UpdateParkDto } from './dto/bowling-parks.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles, UserRole } from '@app/shared/types';
import { RoleGuard } from '@app/shared/authentication/role.guard';

@ApiTags('bowling-parks')
@Roles(UserRole.ADMIN)
@Controller('bowling-parks')
export class BowlingParksController {
  constructor(private readonly bowlingParksService: BowlingParksService) {}

  @Post()
  @UseGuards(RoleGuard)
  async createBowlingPark(@Body() data: CreateParkDto) {
    return this.bowlingParksService.createPark(data);
  }

  @Get()
  @UseGuards(RoleGuard)
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
  @UseGuards(RoleGuard)
  async findOne(@Param('id') id: string) {
    return this.bowlingParksService.getBowlingParkBy({ id });
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  async update(@Param('id') id: string, @Body() updateParkDto: UpdateParkDto) {
    return this.bowlingParksService.updateBowlingPark(id, updateParkDto);
  }
}
