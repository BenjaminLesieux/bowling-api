import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number(),
    }),
  ),
  // orderId must be uuid
  orderId: z.string().uuid(),
});
export class AddProductDto extends createZodDto(createCheckoutSchema) {}
