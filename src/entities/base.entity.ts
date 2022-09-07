import { z } from 'nestjs-zod/z'

export const idSchema = z.string().uuid()
export type IdT = z.infer<typeof idSchema>

export const baseEntitySchema = z.object({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type BaseEntity = z.infer<typeof baseEntitySchema>
