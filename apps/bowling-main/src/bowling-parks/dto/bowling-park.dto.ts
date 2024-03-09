import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { createInsertSchema } from 'drizzle-zod';
import schemas from '../../database/schemas';

export const createParkSchema = createInsertSchema(schemas.bowlingParks);
export const updateParkSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const searchParkSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export class BowlingParkDto extends createZodDto(createParkSchema) {}
export class UpdateParkDto extends createZodDto(updateParkSchema) {}
export class SearchParkDto extends createZodDto(searchParkSchema) {}
