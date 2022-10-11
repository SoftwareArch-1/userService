import { ActivityModel } from '../zod'

export const eachInAll = ActivityModel.omit({
  pendingUserIds: true,
})

export const findAllActivityDto = eachInAll.array()
