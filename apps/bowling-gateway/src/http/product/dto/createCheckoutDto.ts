<<<<<<<< HEAD:apps/bowling-gateway/src/order/dto/createCheckoutDto.ts
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
========
import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createCheckoutSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().positive('quantity must be positive'),
    }),
  ),
});

const checkoutSchema = z.object({
  products: createCheckoutSchema,
  user: z.any(),
});

export class CreateCheckoutDto extends createZodDto(createCheckoutSchema) {}
export type Checkout = z.infer<typeof checkoutSchema>;
>>>>>>>> master:apps/bowling-gateway/src/http/product/dto/createCheckoutDto.ts
