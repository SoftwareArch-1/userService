import { z } from 'nestjs-zod/z'

export const declineJoinResDtoSchema = z.object({
  pendingUserIds: z.preprocess((v) => v ?? [], z.string().array()),
})
