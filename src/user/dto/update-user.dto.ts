import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

import { createUserDtoSchema } from './create-user.dto'

export const updateUserDtoSchema = createUserDtoSchema
  .extend({
    description: z.string().nullable(),
    birthDate: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date()),
  })
  .strict()
  .partial()

export class UpdateUserDto extends createZodDto(updateUserDtoSchema) {}
