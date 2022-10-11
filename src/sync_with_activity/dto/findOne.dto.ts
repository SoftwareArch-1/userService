import { z } from 'nestjs-zod/z'

import { activityUser } from '../activity-user'
import { ActivityModel } from '../zod'

const base = ActivityModel.omit({
  pendingUserIds: true,
  joinedUserIds: true,
}).extend({
  ownerName: z.string(),
  joinedUsers: activityUser.array(),
  status: z.enum(['pending', 'joined', 'owned', 'not-joined']),
})

export const ActivityStatus = base.shape.status.enum

export const findOneByOwner = base.extend({
  pendingUsers: activityUser.array(),
})

export const findOneByNotOwner = base

export type FindOneByOwner = z.infer<typeof findOneByOwner>

export type FindOneByNotOwner = z.infer<typeof findOneByNotOwner>
