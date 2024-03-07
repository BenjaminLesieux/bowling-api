import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const sessionClosedEmailSchema = z.object({
  laneNumber: z.number(),
  parkName: z.string(),
});

export class SessionClosedEmailDto extends createZodDto(sessionClosedEmailSchema) {}
