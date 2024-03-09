import { Inject, Injectable } from '@nestjs/common';
import { BowlingParkDto, SearchParkDto, UpdateParkDto } from './dto/bowling-park.dto';
import { eq } from 'drizzle-orm';
import schemas, { BowlingPark } from '../database/schemas';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import { RpcError } from '@app/shared/infrastructure/utils/errors/rpc-error';

@Injectable()
export class BowlingParksService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

  async getBowlingParks(): Promise<BowlingPark[]> {
    return await this.db.select().from(schemas.bowlingParks).execute();
  }

  async getBowlingParkBy(search: SearchParkDto): Promise<BowlingPark[]> {
    if (search.id) {
      return await this.db.select().from(schemas.bowlingParks).where(eq(schemas.bowlingParks.id, search.id)).execute();
    } else {
      const limit = search.limit || 10;
      const page = search.page || 1;
      const offset = (page - 1) * limit;

      if (search.name) {
        return await this.db.select().from(schemas.bowlingParks).where(eq(schemas.bowlingParks.name, search.name)).limit(limit).offset(offset).execute();
      }

      return await this.db.select().from(schemas.bowlingParks).limit(limit).offset(offset).execute();
    }
  }

  async createBowlingPark(data: BowlingParkDto): Promise<BowlingPark> {
    try {
      const inserted = await this.db
        .insert(schemas.bowlingParks)
        .values(data as BowlingPark)
        .returning();

      return inserted[0];
    } catch (error) {
      throw new RpcError({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateBowlingPark(data: UpdateParkDto): Promise<BowlingPark> {
    try {
      const updated = await this.db.update(schemas.bowlingParks).set(data).returning();
      return updated[0];
    } catch (error) {
      throw new RpcError({
        status: 400,
        message: error.message,
      });
    }
  }

  async deleteBowlingPark(id: string): Promise<BowlingPark> {
    try {
      const deleted = await this.db.delete(schemas.bowlingParks).where(eq(schemas.bowlingParks.id, id)).returning();
      return deleted[0];
    } catch (error) {
      throw new RpcError({
        status: 500,
        message: error.message,
      });
    }
  }
}
