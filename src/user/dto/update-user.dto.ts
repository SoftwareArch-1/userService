import { createZodDto } from 'nestjs-zod'
import { createUserDtoSchema } from './create-user.dto'

export const updateUserDtoSchema = createUserDtoSchema.partial()

export class UpdateUserDto extends createZodDto(updateUserDtoSchema) {}
