import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z
      .password()
      .atLeastOne('lowercase')
      .atLeastOne('uppercase')
      .atLeastOne('digit')
      .min(8),
    rePassword: z
      .password()
      .atLeastOne('lowercase')
      .atLeastOne('uppercase')
      .atLeastOne('digit')
      .min(8),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'],
  });

export class CreateUserDto extends createZodDto(createUserSchema) {}
