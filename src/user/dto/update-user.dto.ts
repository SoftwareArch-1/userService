import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

import { createUserDtoSchema } from './create-user.dto'

export const updateUserDtoSchema = createUserDtoSchema
  .extend({
    description: z.string().nullable(),
    discordId: z.string().nullable(),
    lineId: z.string().nullable(),
  })
  .strict()
  .partial()

export class UpdateUserDto extends createZodDto(updateUserDtoSchema) {}
