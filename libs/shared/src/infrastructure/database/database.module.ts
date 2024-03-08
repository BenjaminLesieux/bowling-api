import { DynamicModule, Global, Module } from '@nestjs/common';
import { databaseProvider } from '@app/shared/database/database.provider';
import { DbMicroservice } from '@app/shared/services';

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
