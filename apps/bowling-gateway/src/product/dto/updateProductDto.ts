import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const updateProductSchema = z.object({
  name: z.string().max(255, 'name too long (255 max)'),
  newName: z.string().max(255, 'new name too long (255 max)').optional(),
  price: z.number().positive('price must be positive').optional(),
});
export class UpdateProductDto extends createZodDto(updateProductSchema) {}
