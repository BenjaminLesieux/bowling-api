import { Inject, Injectable } from '@nestjs/common';
import {
  CreateParkDto,
  SearchParkDto,
  UpdateParkDto,
} from './dto/create-park.dto';
import {
  DATABASE_PROVIDER,
  PostgresDatabase,
} from '@app/shared/database/database.provider';
import schemas, { BowlingPark } from '@app/shared/database/schemas/schemas';
import { eq } from 'drizzle-orm';
import { CreateAlleyDto, SearchAlleyDto } from './dto/alley.dto';
import { RpcError } from '@app/shared/rpc-error';

@Injectable()
export class BowlingParksService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase,
  ) {}

  async getBowlingParks() {
    return await this.db.select().from(schemas.bowlingParkTable).execute();
  }

  async getBowlingParkBy(search: SearchParkDto) {
    if (search.id) {
      return await this.db
        .select()
        .from(schemas.bowlingParkTable)
        .where(eq(schemas.bowlingParkTable.id, search.id))
        .execute();
    } else {
      return await this.db
        .select()
        .from(schemas.bowlingParkTable)
        .where(eq(schemas.bowlingParkTable.name, search.name))
        .execute();
    }
  }

  async createBowlingPark(data: CreateParkDto) {
    try {
      const inserted = await this.db
        .insert(schemas.bowlingParkTable)
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

  async updateBowlingPark(data: UpdateParkDto) {
    try {
      const updated = await this.db
        .update(schemas.bowlingParkTable)
        .set(data)
        .returning();
      return updated[0];
    } catch (error) {
      throw new RpcError({
        status: 400,
        message: error.message,
      });
    }
  }

  async deleteBowlingPark(id: string) {
    try {
      const deleted = await this.db
        .delete(schemas.bowlingParkTable)
        .where(eq(schemas.bowlingParkTable.id, id))
        .returning();
      return deleted[0];
    } catch (error) {
      throw new RpcError({
        status: 500,
        message: error.message,
      });
    }
  }

  async addBowlingAlley(data: CreateAlleyDto) {
    const parkId = data.bowlingParkId;

    try {
      const alley = await this.db
        .insert(schemas.bowlingAlleyTable)
        .values({
          laneNumber: data.laneNumber,
          bowlingParkId: parkId,
        })
        .returning();

      return alley[0];
    } catch (error) {
      throw new RpcError({
        status: 400,
        message: error.message,
      });
    }
  }

  async deleteBowlingAlley(id: string) {
    try {
      const deleted = await this.db
        .delete(schemas.bowlingAlleyTable)
        .where(eq(schemas.bowlingAlleyTable.id, id))
        .returning();
      return deleted[0];
    } catch (error) {
      throw new RpcError({
        status: 500,
        message: error.message,
      });
    }
  }

  async getBowlingAlleys() {
    return await this.db.select().from(schemas.bowlingAlleyTable).execute();
  }

  async getBowlingAlleyBy(search: SearchAlleyDto) {
    console.log(search);
    if (search.id) {
      return await this.db
        .select({
          bowlingAlleyId: schemas.bowlingAlleyTable.id,
          laneNumber: schemas.bowlingAlleyTable.laneNumber,
          bowlingParkId: schemas.bowlingAlleyTable.bowlingParkId,
        })
        .from(schemas.bowlingAlleyTable)
        .where(eq(schemas.bowlingAlleyTable.id, search.id))
        .execute();
    } else {
      if (search.laneNumber) {
        return this.db
          .select({
            bowlingAlleyId: schemas.bowlingAlleyTable.id,
            laneNumber: schemas.bowlingAlleyTable.laneNumber,
            bowlingParkId: schemas.bowlingAlleyTable.bowlingParkId,
          })
          .from(schemas.bowlingAlleyTable)
          .where(eq(schemas.bowlingAlleyTable.laneNumber, search.laneNumber))
          .having(
            eq(schemas.bowlingAlleyTable.bowlingParkId, search.bowlingParkId),
          )
          .execute();
      } else {
        return await this.db
          .select({
            bowlingAlleyId: schemas.bowlingAlleyTable.id,
            laneNumber: schemas.bowlingAlleyTable.laneNumber,
            bowlingParkId: schemas.bowlingAlleyTable.bowlingParkId,
          })
          .from(schemas.bowlingAlleyTable)
          .execute();
      }
    }
  }
}
