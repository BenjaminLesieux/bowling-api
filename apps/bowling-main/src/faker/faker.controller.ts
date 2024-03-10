import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { FakerService } from './faker.service';
import FakerCommands from '@app/shared/infrastructure/transport/commands/FakerCommands';
import { User } from '@app/shared';

@Controller()
export class FakerController {
  constructor(private readonly fakerService: FakerService) {}

  @MessagePattern(FakerCommands.INIT_FAKER)
  async updateProduct(@Payload() data: User, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);

    console.log(data);
    return await this.fakerService.init(data);
  }
}
