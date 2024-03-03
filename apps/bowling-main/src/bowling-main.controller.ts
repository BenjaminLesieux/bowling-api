import { Controller } from '@nestjs/common';
import { BowlingMainService } from './bowling-main.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BowlingMainController {
  constructor(private readonly bowlingMainService: BowlingMainService) {}

  @MessagePattern({
    cmd: 'hello',
  })
  getHello(): string {
    return this.bowlingMainService.getHello();
  }
}
