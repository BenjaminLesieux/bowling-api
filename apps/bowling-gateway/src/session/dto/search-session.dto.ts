import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const searchSessionPayloadSchema = z.object({
  limit: z.number(),
  page: z.number(),
});

const searchSessionSchema = searchSessionPayloadSchema.extend({
  alleyId: z.string().uuid().optional(),
  parkId: z.string().uuid().optional(),
});

export class SearchSessionDto extends createZodDto(searchSessionSchema) {}
export class SearchSessionPayloadDto extends createZodDto(searchSessionPayloadSchema) {}
