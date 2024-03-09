import { Inject, Injectable } from '@nestjs/common';
import { CreateAlleyDto, SearchAlleyDto } from './dto/bowling-alley.dto';
import schemas, { BowlingAlley } from '../database/schemas';
import { eq } from 'drizzle-orm';
import { QrcodeService } from '../qrcode/qrcode.service';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import { RpcError } from '@app/shared/infrastructure/utils/errors/rpc-error';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BowlingAlleysService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
    private readonly qrCodeService: QrcodeService,
    private readonly configService: ConfigService,
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

  async getBowlingAlleys(): Promise<BowlingAlley[]> {
    return await this.db.select().from(schemas.bowlingAlleys).execute();
  }

  async getBowlingAlleyBy(search: SearchAlleyDto): Promise<BowlingAlley> {
    const selectQuery = {
      id: schemas.bowlingAlleys.id,
      laneNumber: schemas.bowlingAlleys.laneNumber,
      bowlingParkId: schemas.bowlingAlleys.bowlingParkId,
    };

    const limit = search.limit || 10;
    const page = search.page || 1;
    const offset = (page - 1) * limit;

    if (search.id) {
      return (
        await this.db.select(selectQuery).from(schemas.bowlingAlleys).where(eq(schemas.bowlingAlleys.id, search.id)).limit(limit).offset(offset).execute()
      ).at(0);
    } else {
      if (search.laneNumber) {
        return (
          await this.db
            .select(selectQuery)
            .from(schemas.bowlingAlleys)
            .where(eq(schemas.bowlingAlleys.laneNumber, search.laneNumber))
            .having(eq(schemas.bowlingAlleys.bowlingParkId, search.bowlingParkId))
            .limit(limit)
            .offset(offset)
            .execute()
        ).at(0);
      } else {
        return (await this.db.select(selectQuery).from(schemas.bowlingAlleys).limit(limit).offset(offset).execute()).at(0);
      }
    }
  }

  async getQrCode(id: string) {
    const link = this.getCatalogLink(id);
    return this.qrCodeService.qrcode(link);
  }

  async getCatalogOfId(id: string) {
    const alley = (await this.db.select().from(schemas.bowlingAlleys).where(eq(schemas.bowlingAlleys.id, id)).execute())[0];
    const catalog = await this.db.select().from(schemas.catalog).where(eq(schemas.catalog.bowlingParkId, alley.bowlingParkId)).execute();
    //TODO: fix with a better query
    return catalog.map(async (c) => (await this.db.select().from(schemas.products).where(eq(schemas.products.id, c.productId)))[0]);
  }

  getCatalogLink(id: string) {
    return `${this.configService.get('BASE_URL')}/bowling-alleys/catalog?qrCode=${id}`;
  }
}
