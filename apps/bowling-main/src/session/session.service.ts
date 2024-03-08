import { Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import schemas, { sessions } from '../database/schemas';
import { ClientProxy } from '@nestjs/microservices';
import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/infrastructure/database/database.provider';
import { MAIN_MICROSERVICE } from '@app/shared';
import { AddSessionDto } from '../../../bowling-gateway/src/http/session/dto/addSessionDto';

@Injectable()
export class SessionService {
  constructor(
    @Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>,
    @Inject(MAIN_MICROSERVICE) private readonly mainClient: ClientProxy,
  ) {}

  async addSession(data: AddSessionDto) {
    try {
      const existingStartedSession = (
        await this.db
          .select()
          .from(schemas.sessions)
          .where(and(eq(sessions.bowlingAlleyId, data.bowlingAlleyId), or(eq(sessions.status, 'started'), eq(sessions.status, 'payment_pending'))))
      ).at(0);

      if (existingStartedSession) throw new Error('Session id already started for this alley');

      const createdSession = (await this.db.insert(sessions).values(data).returning()).at(0);

      // const order = await lastValueFrom(
      //   this.mainClient.emit(
      //     {
      //       cmd: 'on-session-create',
      //     },
      //     // TODO gérer l'id
      //     { id: '6f89a401-d838-44d6-afe0-cda6da1320d7', userId: data.userId },
      //   ),
      // );

      // const linkedSession = (
      //   await this.db
      //     .update(sessions)
      //     .set({
      //       orderId: order.id,
      //     })
      //     .where(eq(sessions.id, createdSession.id))
      //     .returning()
      // ).at(0);

      return createdSession;
    } catch (err) {
      console.log('Error adding session', data, err);
    }
    return data;
  }

  async terminateSession(id: string) {
    console.log('deep terminateSession', id);
    try {
      const existingSession = (await this.db.select().from(schemas.sessions).where(eq(sessions.id, id))).at(0);

      if (!existingSession) throw new Error(`Session not found ${id}`);

      if (existingSession.status === 'finished') throw new Error(`Session ${id} already terminated`);

      const updatedSession = await this.db
        .update(sessions)
        .set({
          end: new Date().toString(),
          status: 'finished',
        })
        .where(eq(sessions.id, id));
      return updatedSession;
    } catch (err) {
      console.log('Error terminating session', id, err);
    }
  }
}
