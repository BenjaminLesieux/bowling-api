import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z
      .password()
      .atLeastOne('digit')
      .atLeastOne('lowercase')
      .atLeastOne('uppercase')
      .min(8),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword);

export class CreateUserDto extends createZodDto(createUserSchema) {}
