import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const addSessionSchema = z.object({
  bowlingAlleyId: z.string().uuid(),
  userId: z.string().uuid(),
});
export class AddSessionDto extends createZodDto(addSessionSchema) {}
