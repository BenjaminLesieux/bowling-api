import { User } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakerService {
  async init(data: User) {
    console.log(data);
    return {
      ok: true,
    };
  }
}
