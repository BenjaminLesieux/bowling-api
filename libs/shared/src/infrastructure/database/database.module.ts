import { DynamicModule, Global, Module } from '@nestjs/common';
import { DbMicroservice } from '@app/shared/infrastructure/transport/services';
import { databaseProvider } from '@app/shared/infrastructure/database/database.provider';

@Global()
@Module({})
export class DatabaseModule {
  static register(database: DbMicroservice, schema: Record<string, unknown>): DynamicModule {
    const provider = databaseProvider(database, schema);
    return {
      module: DatabaseModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
