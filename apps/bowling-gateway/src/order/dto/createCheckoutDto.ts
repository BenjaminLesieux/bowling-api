import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  amountToPay: z.number(),
  orderId: z.string(),
});
export class CreateCheckoutDto extends createZodDto(createCheckoutSchema) {}
