import { DATABASE_PROVIDER, PostgresDatabase } from '@app/shared/database/database.provider';
import { Inject, Injectable } from '@nestjs/common';
import { AddSessionDto } from 'apps/bowling-gateway/src/session/dto/addSessionDto';
import { sessions } from '@app/shared/database/schemas/schemas';
import { and, eq, or } from 'drizzle-orm';

@Injectable()
export class SessionService {
  constructor(@Inject(DATABASE_PROVIDER) private readonly db: PostgresDatabase) {}

  async addSession(data: AddSessionDto) {
    try {
      const existingStartedSession = await this.db.query.sessions.findFirst({
        where: and(eq(sessions.bowlingAlleyId, data.bowlingAlleyId), or(eq(sessions.status, 'started'), eq(sessions.status, 'payment_pending'))),
      });

      if (existingStartedSession) throw new Error('Session id already started for this alley');

      const createdSession = await this.db.insert(sessions).values(data);
      return createdSession;
    } catch (err) {
      console.log('Error adding session', data);
    }
    return data;
  }
}
