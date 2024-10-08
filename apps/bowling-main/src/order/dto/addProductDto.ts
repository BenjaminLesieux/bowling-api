import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
  orderId: z.string().uuid(),
  userId: z.string().uuid(),
});
export class AddProductDto extends createZodDto(createCheckoutSchema) {}
