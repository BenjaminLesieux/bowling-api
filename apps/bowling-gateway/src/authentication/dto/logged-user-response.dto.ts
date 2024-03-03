import { z } from 'nestjs-zod/z';

const loggedUserResponseSchema = z.object({
  user: z.object({
    email: z.string().email(),
  }),
  token: z.string(),
  expiresIn: z.number(),
});

export type LoggedUserResponseDto = z.infer<typeof loggedUserResponseSchema>;
