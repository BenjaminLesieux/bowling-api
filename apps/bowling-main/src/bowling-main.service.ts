import { Injectable } from '@nestjs/common';

@Injectable()
export class BowlingMainService {
  getHello(): string {
    return 'Hello World!';
  }

  async initDb() {
    return 'init-db';
  }
}
