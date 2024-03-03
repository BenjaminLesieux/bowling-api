import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const logUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class LogUserDto extends createZodDto(logUserSchema) {}
