import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import schemas, { Session, sessions } from '../database/schemas';
import { OrderService } from '../order/order.service';
import { GetBySessionPayloadDto } from './dto/get-by-session-payload.dto';
import { ClientProxy } from '@nestjs/microservices';
import { BowlingParksService } from '../bowling-parks/bowling-parks.service';
import { BowlingAlleysService } from '../bowling-alleys/bowling-alleys.service';
import { logger } from '../main';
import { User } from '@app/shared/adapters/user.type';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import { MAILER_MICROSERVICE } from '@app/shared';
import { AddSessionDto } from './dto/add-session.dto';
import { RpcError } from '@app/shared/infrastructure/utils/errors/rpc-error';

@Injectable()
export class SessionService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
    @Inject(MAILER_MICROSERVICE) private readonly mailer: ClientProxy,
    private readonly orderService: OrderService,
    private readonly bowlingParksService: BowlingParksService,
    private readonly bowlingAlleysService: BowlingAlleysService,
  ) {}

  async addSession(data: AddSessionDto) {
    const existingStartedSession = (
      await this.db
        .select()
        .from(schemas.sessions)
        .where(and(eq(sessions.bowlingAlleyId, data.bowlingAlleyId), or(eq(sessions.status, 'started'), eq(sessions.status, 'payment_pending'))))
    ).at(0);

    if (existingStartedSession)
      throw new RpcError({
        status: 400,
        message: 'Session already started',
      });

    const createdSession = (await this.db.insert(sessions).values(data).returning()).at(0);
    const generatedOrder = await this.orderService.createOrder(createdSession.id, data.userId);

    return (await this.db.update(schemas.sessions).set({ orderId: generatedOrder.id }).where(eq(sessions.id, createdSession.id)).returning()).at(0);
  }

  async terminateSession(payload: { id: string; user: User }) {
    const existingSession = (await this.db.select().from(schemas.sessions).where(eq(sessions.id, payload.id))).at(0);

    if (!existingSession)
      throw new RpcError({
        message: `Session not found ${payload.id}`,
        status: HttpStatus.BAD_REQUEST,
      });

    if (existingSession.status === 'finished')
      throw new RpcError({
        message: `Session ${payload.id} already terminated`,
        status: HttpStatus.BAD_REQUEST,
      });

    const updatedSession = (
      await this.db
        .update(sessions)
        .set({
          status: 'finished',
        })
        .where(eq(sessions.id, payload.id))
        .returning()
    )[0];

    const updatedOrder = await this.orderService.updateOrder(existingSession.orderId, { status: 'finished' });

    const info = await this.getInfo(updatedSession);

    return {
      session: updatedSession,
      order: updatedOrder,
      info,
    };
  }

  async getBy(data: GetBySessionPayloadDto) {
    const limit = data.limit;
    const page = data.page;
    const offset = (page - 1) * limit;

    return this.db
      .select()
      .from(sessions)
      .where(data.alleyId && eq(sessions.bowlingAlleyId, data.alleyId))
      .limit(limit)
      .offset(offset)
      .execute();
  }

  private async sendEmailNotification(session: Session, user: User) {
    const info = await this.getInfo(session);
    logger.log(info);
    return this.mailer
      .send(
        { cmd: 'send-mail' },
        {
          to: user.email,
          subject: 'Session Closed',
          text: `Hello ${user.email}, your session ${info.parkName} on lane ${info.laneNumber} has been closed.`,
        },
      )
      .pipe();
  }

  private async getInfo(session: Session) {
    const alley = (
      await this.bowlingAlleysService.getBowlingAlleyBy({
        id: session.bowlingAlleyId,
      })
    )[0];
    const park = (await this.bowlingParksService.getBowlingParkBy({ id: alley.bowlingParkId }))[0];
    return {
      parkName: park.name,
      laneNumber: alley.laneNumber,
    };
  }

  async getAllSessions() {
    return this.db.select().from(sessions).execute();
  }

  async getSession(id: string) {
    return this.db.select().from(sessions).where(eq(sessions.id, id)).execute();
  }
}
