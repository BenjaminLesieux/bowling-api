import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
});
export class AddProductDto extends createZodDto(createCheckoutSchema) {}
