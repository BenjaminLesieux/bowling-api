import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const searchOrderSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export class SearchOrderDto extends createZodDto(searchOrderSchema) {}
