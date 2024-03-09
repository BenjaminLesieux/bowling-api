import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const searchProductSchema = z.object({
  lastId: z.string().optional(),
});
export class SearchProductDto extends createZodDto(searchProductSchema) {}
