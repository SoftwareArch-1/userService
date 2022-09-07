import { z } from 'nestjs-zod/z'
import { baseEntitySchema } from 'src/entities/base.entity'

export const userSchema = baseEntitySchema.merge(
  z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6),
  }),
)

export type UserT = z.infer<typeof userSchema>
