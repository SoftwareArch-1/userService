import { z } from 'nestjs-zod/z'

export const declineJoinResDtoSchema = z.object({
  pendingUserIds: z.string().array(),
})
