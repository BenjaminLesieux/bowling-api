import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, User } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '@app/shared/infrastructure/utils/decorators/user.decorator';
import { FakerService } from './faker.service';

@ApiTags('faker')
@Controller('faker')
export class FakerController {
  constructor(private readonly fakerService: FakerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/init')
  async init(@ReqUser() user: User) {
    return this.fakerService.init(user);
  }
}
