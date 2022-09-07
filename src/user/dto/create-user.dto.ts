import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const createUserDtoSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

export class CreateUserDto extends createZodDto(createUserDtoSchema) {}
