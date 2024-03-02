import { Controller, Get } from '@nestjs/common';
import { BowlingMainService } from './bowling-main.service';

@Controller()
export class BowlingMainController {
  constructor(private readonly bowlingMainService: BowlingMainService) {}

  @Get()
  getHello(): string {
    return this.bowlingMainService.getHello();
  }
}
