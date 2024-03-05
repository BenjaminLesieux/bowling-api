import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { Inject, Injectable } from '@nestjs/common';
import { AddSessionDto } from 'apps/bowling-gateway/src/session/dto/addSessionDto';
import { sessions } from '@app/shared/database/schemas/schemas';
import { and, eq, or } from 'drizzle-orm';
import schemas from '../database/schemas';

@Injectable()
export class SessionService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase<typeof schemas>) {}

  async addSession(data: AddSessionDto) {
    try {
      const existingStartedSession = (
        await this.db
          .select()
          .from(schemas.sessions)
          .where(and(eq(sessions.bowlingAlleyId, data.bowlingAlleyId), or(eq(sessions.status, 'started'), eq(sessions.status, 'payment_pending'))))
      ).at(0);

      if (existingStartedSession) throw new Error('Session id already started for this alley');

      const createdSession = await this.db.insert(sessions).values(data);
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
