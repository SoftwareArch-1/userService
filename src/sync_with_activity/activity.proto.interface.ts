import type { Observable } from 'rxjs'
import { z } from 'nestjs-zod/z'
import { createZodDto } from 'nestjs-zod'
import { ActivityModel } from './zod'

export interface ActivityService {
  create: (data: CreateActivity) => Observable<Activity>
  findOne: (data: ActivityById) => Observable<Activity>
  findMany(data: FindManyParams): Observable<Activity>
  join: (data: JoinActivity) => Observable<Activity>
  findOwnedActivities: (data: FindOwnedActivities) => Observable<Activity>
}

export interface FindOwnedActivities {
  ownerId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FindManyParams {}

export interface ActivityById {
  id: string
}

export const createActivitySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  ownerId: z.string(),
  targetDate: z.string(),
  maxParticipants: z.number().int().min(1),
  requireLine: z.boolean(),
  requireDiscord: z.boolean(),
  tag: z.string(),
  location: z.string().nullish(),
})

export const joinActivitySchema = z.object({
  activityId: z.string(),
  joinerId: z.string(),
})

export const findOwnedActivitiesSchema = z.object({
  ownerId: z.string(),
})

export class JoinActivity extends createZodDto(joinActivitySchema) {}

export class CreateActivity extends createZodDto(createActivitySchema) {}

export type Activity = z.infer<typeof ActivityModel>
