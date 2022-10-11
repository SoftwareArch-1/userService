import { z } from 'nestjs-zod/z'

export const findOneUserResponseDto = z.object({
  profile: z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    id: z.string(),
    description: z.string().nullish(),
    discordId: z.string().nullish(),
    lineId: z.string().nullish(),
  }),
  reviews: z.array(
    z.object({
      content: z.string(),
      id: z.string(),
      stars: z.number().int().min(1).max(5),
      createdAt: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
      }, z.date()),
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
