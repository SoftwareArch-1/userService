import { ActivityModel } from '../zod'

export const findOneByOwner = ActivityModel

export const findOneByJoinedUser = ActivityModel.omit({
  pendingUserIds: true,
})

export const findOneByOutsider = ActivityModel.omit({
  pendingUserIds: true,
  joinedUserIds: true,
})
