import { z } from 'nestjs-zod/z'
import { createZodDto } from 'nestjs-zod'

export const createReviewDtoSchema = z
  .object({
    content: z
      .string()
      .max(500, 'Maximum review content length is 500 characters'),
    stars: z
      .number()
      .min(1, 'Minimum star rating is 1')
      .max(5, 'Maximum star rating is 5'),
    revieweeId: z.string(),
  })
  .strict()

export class CreateReviewDto extends createZodDto(createReviewDtoSchema) {}
