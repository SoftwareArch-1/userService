import { z } from 'nestjs-zod/z'

export const createReviewResponseDtoSchema = z.string()

export type CreateReviewResponseDto = z.infer<
  typeof createReviewResponseDtoSchema
>
