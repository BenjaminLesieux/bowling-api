import { Module } from '@nestjs/common';
import { databaseProvider } from '@app/shared/database/database.provider';

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
