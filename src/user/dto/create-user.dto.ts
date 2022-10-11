import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const createUserDtoSchema = z.object({
  name: z.string().min(3),
  surname: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  birthDate: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
  }, z.date()),
})

export class CreateUserDto extends createZodDto(createUserDtoSchema) {}
