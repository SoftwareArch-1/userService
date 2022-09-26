// import { User } from '@prisma/client'
import { z } from 'nestjs-zod/z'
/**
 * zod schema for `User` from '@prisma/client'
 */
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  surname: z.string(),
  description: z.string().nullable(),
  birthDate: z.date().nullable(),
})

export const strippedPasswordUserSchema = userSchema.omit({ password: true })
