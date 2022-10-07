import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'
import { map, toArray } from 'rxjs/operators'

import { OnModuleInit } from '@nestjs/common'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common/decorators'
import { ClientGrpc } from '@nestjs/microservices'
import { ApiResponse } from '@nestjs/swagger'

import { ActivityService, CreateActivity } from './activity.proto.interface'
import { eachInAll, findAllActivityDto } from './dto/finAll.dto'
import { findOneByJoinedUser, findOneByOutsider } from './dto/findOne.dto'
import { ActivityModel } from './zod'

@Controller('activity')
export class ActivityController implements OnModuleInit {
  constructor(
    @Inject('ACTIVITY_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  private activityService: ActivityService

  onModuleInit() {
    this.activityService =
      this.client.getService<ActivityService>('ActivityService')
  }

  @Post()
  @ApiResponse({
    schema: zodToOpenAPI(ActivityModel),
  })
  @UseZodGuard('body', CreateActivity)
  create(@Body() data: CreateActivity) {
    return this.activityService.create(data)
  }

  @Get()
  @ApiResponse({
    schema: zodToOpenAPI(findAllActivityDto),
  })
  findAll() {
    const stream = this.activityService.findMany({})
    return stream.pipe(
      map((a) => eachInAll.parse(a)),
      toArray(),
    )
  }

  @Get(':id')
  @ApiResponse({
    schema: zodToOpenAPI(
      ActivityModel.or(findOneByJoinedUser).or(findOneByOutsider),
    ),
  })
  findOne(@Param('id') id: string) {
    return this.activityService.findOne({ id }).pipe(
      map((act) => {
        const userId = 'userIdRequest' // TODO: get user id from req
        if (act.ownerId === userId) {
          return act
        }
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          pendingUserIds, // only owner can see pending users

          joinedUserIds, // joined or owner can see this
          ...rest
        } = act

        if (act.joinedUserIds.includes(userId)) {
          const dto = {
            joinedUserIds,
            ...rest,
          }
          const result = findOneByJoinedUser.safeParse(dto)
          if (!result.success) {
            console.error(
              'Invalid find one activity by joined users\n',
              result.error,
            )
          }
          return dto
        }

        const result = findOneByOutsider.safeParse(rest)
        if (!result.success) {
          console.error('Invalid find one activity by outsider\n', result.error)
        }
        // outsiders see this
        return rest
      }),
    )
  }
}
