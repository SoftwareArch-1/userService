import { ActivityModel } from '../zod'

export const eachInAll = ActivityModel.omit({
  pendingUserIds: true,
  joinedUserIds: true,
})

export const findAllActivityDto = ActivityModel.array()
