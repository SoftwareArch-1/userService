import { z } from 'nestjs-zod/z'

export const findOneUserResponseDto = z.object({
  profile: z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    id: z.string().cuid(),
  }),
  reviews: z.array(
    z.object({
      content: z.string(),
      id: z.string().cuid(),
      stars: z.number().int().min(1).max(5),
      reviewer: z.object({
        name: z.string(),
        surname: z.string(),
      }),
    }),
  ),
  stars: z.object({
    1: z.number().int().min(0),
    2: z.number().int().min(0),
    3: z.number().int().min(0),
    4: z.number().int().min(0),
    5: z.number().int().min(0),
  }),
})

export type FindOneUserResponseDto = z.infer<typeof findOneUserResponseDto>
