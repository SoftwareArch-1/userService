import { z } from 'nestjs-zod/z'

export const acceptJoinResDtoSchema = z.object({
  joinedUserIds: z.preprocess((v) => v ?? [], z.string().array()),
  pendingUserIds: z.preprocess((v) => v ?? [], z.string().array()),
})
