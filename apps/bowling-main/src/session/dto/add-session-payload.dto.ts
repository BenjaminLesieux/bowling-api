import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const addSessionPayloadSchema = z.object({
  bowlingAlleyId: z.string().uuid(),
});

export class AddSessionPayloadDto extends createZodDto(addSessionPayloadSchema) {}
