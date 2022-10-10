import { z } from 'nestjs-zod/z'
import { ActivityModel } from '../zod'

const eachInAll = ActivityModel.omit({
  pendingUserIds: true,
})

// from grpc server
export const actualEachInAll = eachInAll.extend({
  // gRPC won't send empty arrays
  joinedUserIds: z.string().array().optional(),
  pendingUserIds: z.string().array().optional(),
})

export const findAllActivityDto = eachInAll.array()
