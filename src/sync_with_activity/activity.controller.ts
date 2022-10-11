import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'
import { prismaClient } from 'prisma/script'
import { catchError, map, toArray } from 'rxjs/operators'

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
import { ApiHeader, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'

import { ActivityUser } from './activity-user'
import {
  AcceptJoin,
  ActivityService,
  CreateActivity,
  JoinActivity,
} from './activity.proto.interface'
import { eachInAll, findAllActivityDto } from './dto/finAll.dto'
import {
  FindOneByNotOwner,
  findOneByNotOwner,
  FindOneByOwner,
  findOneByOwner,
} from './dto/findOne.dto'
import { ActivityModel } from './zod'
import { HttpException } from '@nestjs/common/exceptions'
import { HttpStatus } from '@nestjs/common/enums'
import { acceptJoinResDtoSchema } from './dto/acceptJoinRes.dto'

@Controller('activity')
@ApiTags('activity')
export class ActivityController implements OnModuleInit {
  constructor(
    @Inject('ACTIVITY_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  private activityService: ActivityService

  onModuleInit() {
    this.activityService =
      this.client.getService<ActivityService>('ActivityService')
  }

  @Get('find-owned-activities/:ownerId')
  @ApiResponse({
    schema: zodToOpenAPI(findAllActivityDto),
  })
  findOwnedActivities(@Param('ownerId') ownerId: string) {
    return this.activityService.findOwnedActivities({ ownerId }).pipe(
      catchError((e) => {
        throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
      }),
      map((data) => eachInAll.parse(data)),
      toArray(),
    )
  }

  @Post('accept-join')
  @ApiResponse({
    schema: zodToOpenAPI(acceptJoinResDtoSchema),
  })
  @UseZodGuard('body', AcceptJoin)
  acceptJoin(@Body() data: AcceptJoin) {
    return this.activityService.acceptJoin(data).pipe(
      catchError((e) => {
        throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
      }),
      map((d) => acceptJoinResDtoSchema.parse(d)),
    )
  }

  @Post('request-join')
  @ApiResponse({
    schema: zodToOpenAPI(
      ActivityModel.omit({
        pendingUserIds: true,
      }),
    ),
  })
  @UseZodGuard('body', JoinActivity)
  join(@Body() data: JoinActivity) {
    return this.activityService.join(data).pipe(
      catchError((e) => {
        // failed to join since maximum participants reached?
        throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
      }),
      map((data) =>
        ActivityModel.omit({
          pendingUserIds: true,
        }).parse(data),
      ),
    )
  }

  @Post()
  @ApiResponse({
    schema: zodToOpenAPI(ActivityModel),
  })
  @UseZodGuard('body', CreateActivity)
  create(@Body() data: CreateActivity) {
    return this.activityService.create(data).pipe(
      catchError((e) => {
        throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
      }),
    )
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
    schema: {
      oneOf: [findOneByOwner, findOneByNotOwner].map(zodToOpenAPI),
    },
  })
  findOne(@Param('id') id: string) {
    const makeActivityUser = ({
      name,
      surname,
      ...rest
    }: User): ActivityUser => ({
      name: `${name} ${surname}`,
      ...rest,
    })
    const findUsers = (ids: string[]) =>
      prismaClient.user.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          id: true,
          name: true,
          surname: true,
          lineId: true,
          discordId: true,
          description: true,
        },
      })

    return this.activityService.findOne({ id }).pipe(
      map((data) => ActivityModel.parse(data)),
      map(async ({ joinedUserIds, ownerId, pendingUserIds, ...rest }) => {
        const users = await findUsers([ownerId, ...joinedUserIds])

        const activityUsers = users.map(makeActivityUser)
        const owner = activityUsers.slice(0, 1)[0]
        const joinedUsers = activityUsers.slice(1)

        const userId = 'userIdRequest' // TODO: get user id from req

        if (ownerId === userId) {
          const dto: FindOneByOwner = {
            joinedUsers,
            ownerId,
            pendingUsers: (await findUsers(pendingUserIds)).map(
              makeActivityUser,
            ),
            ownerName: owner.name,
            isOwner: true,
            ...rest,
          }
          return dto
        }

        const dto: FindOneByNotOwner = {
          joinedUsers,
          ownerId,
          ownerName: owner.name,
          isOwner: false,
          ...rest,
        }
        return dto
      }),
    )
  }
}