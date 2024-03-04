import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const searchSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export const createSchema = z.object({
  name: z.string(),
  website: z.string().url(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
});
export const updateSchema = z.object({
  name: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export class CreateParkDto extends createZodDto(createSchema) {}
export class UpdateParkDto extends createZodDto(updateSchema) {}
export class SearchParkDto extends createZodDto(searchSchema) {}
