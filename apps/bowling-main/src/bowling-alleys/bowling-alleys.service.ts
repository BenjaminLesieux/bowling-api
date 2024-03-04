import { Inject, Injectable } from '@nestjs/common';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alley.dto';
import schemas from '@app/shared/database/schemas/schemas';
import { RpcError } from '@app/shared/rpc-error';
import { eq } from 'drizzle-orm';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { QrcodeService } from '../qrcode/qrcode.service';

@Injectable()
export class BowlingAlleysService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase,
    private readonly qrCodeService: QrcodeService,
  ) {}

  async addBowlingAlley(data: CreateAlleyDto) {
    try {
      const alley = await this.db
        .insert(schemas.bowlingAlleys)
        .values({
          laneNumber: data.laneNumber,
          bowlingParkId: data.bowlingParkId,
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
      const deleted = await this.db.delete(schemas.bowlingAlleys).where(eq(schemas.bowlingAlleys.id, id)).returning();
      return deleted[0];
    } catch (error) {
      throw new RpcError({
        status: 500,
        message: error.message,
      });
    }
  }

  async getBowlingAlleys() {
    return await this.db.select().from(schemas.bowlingAlleys).execute();
  }

  async getBowlingAlleyBy(search: SearchAlleyDto) {
    const selectQuery = {
      bowlingAlleyId: schemas.bowlingAlleys.id,
      laneNumber: schemas.bowlingAlleys.laneNumber,
      bowlingParkId: schemas.bowlingAlleys.bowlingParkId,
    };

    const limit = search.limit || 10;
    const page = search.page || 1;
    const offset = (page - 1) * limit;

    if (search.id) {
      return await this.db.select(selectQuery).from(schemas.bowlingAlleys).where(eq(schemas.bowlingAlleys.id, search.id)).limit(limit).offset(offset).execute();
    } else {
      if (search.laneNumber) {
        return this.db
          .select(selectQuery)
          .from(schemas.bowlingAlleys)
          .where(eq(schemas.bowlingAlleys.laneNumber, search.laneNumber))
          .having(eq(schemas.bowlingAlleys.bowlingParkId, search.bowlingParkId))
          .limit(limit)
          .offset(offset)
          .execute();
      } else {
        return await this.db.select(selectQuery).from(schemas.bowlingAlleys).limit(limit).offset(offset).execute();
      }
    }
  }

  async getQrCode(id: string) {
    return this.qrCodeService.qrcode(id);
  }
}
