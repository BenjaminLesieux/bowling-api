import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const deleteProductSchema = z.object({
  name: z.string().max(255, 'name too long (255 max)'),
});
export class DeleteProductDto extends createZodDto(deleteProductSchema) {}
