import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class AppService {

  registry = new Registry();

  constructor() {
    collectDefaultMetrics({ register: this.registry })
  }

  getHello(): string {
    return 'Hello World!';
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
