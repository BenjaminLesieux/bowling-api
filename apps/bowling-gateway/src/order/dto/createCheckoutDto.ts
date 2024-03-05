import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  amountToPay: z.number(),
  orderId: z.string().uuid(),
});

const checkoutSchema = z.object({
  products: createCheckoutSchema,
  user: z.any(),
});

export class CreateCheckoutDto extends createZodDto(createCheckoutSchema) {}
export type Checkout = z.infer<typeof checkoutSchema>;
