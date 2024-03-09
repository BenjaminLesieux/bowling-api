import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
});

export class EmailDto extends createZodDto(emailSchema) {}
