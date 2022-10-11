import { z } from 'nestjs-zod/z'

export const activityUser = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  lineId: z.string().nullable(),
  discordId: z.string().nullable(),
})

export type ActivityUser = z.infer<typeof activityUser>
