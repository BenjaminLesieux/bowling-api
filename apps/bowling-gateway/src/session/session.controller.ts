import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AddSessionPayloadDto } from './dto/add-session.dto';
import { SessionService } from './session.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@app/shared/authentication/user.decorator';
import { User } from '@app/shared/adapters/user.type';
import { Roles, UserRole } from '@app/shared/types';
import { RoleGuard } from '@app/shared/authentication/role.guard';

@ApiTags('session')
@Controller('session')
@Roles(UserRole.ADMIN)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @UseGuards(RoleGuard)
  @Post()
  async createSession(@Body() body: AddSessionPayloadDto, @ReqUser() user: User) {
    return await this.sessionService.add({
      ...body,
      userId: user.id,
    });
  }

  @UseGuards(RoleGuard)
  @Post('/terminate/:id')
  async terminateSession(@ReqUser() user: User, @Param('id') id: string) {
    return await this.sessionService.terminate(user, id);
  }

  @UseGuards(RoleGuard)
  @Get()
  @ApiParam({
    name: 'parkId',
    required: false,
  })
  @ApiParam({
    name: 'alleyId',
    required: false,
  })
  @ApiParam({
    name: 'limit',
    required: false,
  })
  @ApiParam({
    name: 'page',
    required: false,
  })
  async getSessions(@Query('limit') limit?: number, @Query('page') page?: number, @Query('parkId') parkId?: string, @Query('alleyId') alleyId?: string) {
    return await this.sessionService.getBy({
      parkId,
      alleyId,
      limit,
      page,
    });
  }
}
