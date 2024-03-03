import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const addProductSchema = z.object({
  name: z.string().max(255, 'name too long (255 max)'),
  price: z.number().positive('price must be positive')
})
export class AddProductDto extends createZodDto(addProductSchema) {}
