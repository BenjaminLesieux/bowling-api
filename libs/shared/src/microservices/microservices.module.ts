import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroservicesService } from './microservices.service';

interface MicroserviceOptions {
  name: string;
}

@Module({
  providers: [MicroservicesService],
  exports: [MicroservicesService],
})
export class MicroservicesModule {
  static register({ name }: MicroserviceOptions): DynamicModule {
    return {
      module: MicroservicesModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URL')],
                queue: configService.get<string>(`RABBITMQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
