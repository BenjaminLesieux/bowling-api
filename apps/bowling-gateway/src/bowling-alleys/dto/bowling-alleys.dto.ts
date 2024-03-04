import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createAlleySchema = z.object({
  bowlingParkId: z.string().uuid(),
  laneNumber: z.number().max(20),
});

export const searchAlleySchema = z
  .object({
    id: z.string().uuid().optional(),
    laneNumber: z.number().optional(),
    bowlingParkId: z.string().uuid().optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  })
  .refine((data) => {
    if (!data.id) {
      return data.laneNumber && data.bowlingParkId;
    }

    return data.id;
  });

export class CreateAlleyDto extends createZodDto(createAlleySchema) {}
export class SearchAlleyDto extends createZodDto(searchAlleySchema) {}
