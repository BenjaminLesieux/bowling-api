import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const getOrdersSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export class GetOrdersDto extends createZodDto(getOrdersSchema) {}
