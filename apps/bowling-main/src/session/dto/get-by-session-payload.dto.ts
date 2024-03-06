import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const getBySessionPayloadSchema = z.object({
  alleyId: z.string().uuid().optional(),
  parkId: z.string().uuid().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export class GetBySessionPayloadDto extends createZodDto(getBySessionPayloadSchema) {}
