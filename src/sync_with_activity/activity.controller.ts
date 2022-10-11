import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'
import { prismaClient } from 'prisma/script'
import { catchError, map, toArray } from 'rxjs/operators'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/types'

import { OnModuleInit, Req } from '@nestjs/common'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { HttpException } from '@nestjs/common/exceptions'
import { ClientGrpc } from '@nestjs/microservices'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'

import { ActivityUser } from './activity-user'
import {
  AcceptJoin,
  ActivityService,
  CreateActivity,
  DeclineJoin,
  JoinActivity,
} from './activity.proto.interface'
import { acceptJoinResDtoSchema } from './dto/acceptJoinRes.dto'
import { declineJoinResDtoSchema } from './dto/declineJoinRes.dto'
import { eachInAll, findAllActivityDto } from './dto/finAll.dto'
import {
  ActivityStatus,
  FindOneByNotOwner,
  findOneByNotOwner,
  FindOneByOwner,
  findOneByOwner,
} from './dto/findOne.dto'
import { ActivityModel } from './zod'

@Controller('activity')
@UseGuards(JwtAuthGuard)
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

  @Get('joined')
  @ApiResponse({
    schema: zodToOpenAPI(findAllActivityDto),
  })
  findJoinedActivities(@Req() req: AuthenticatedRequest) {
    return this.activityService
      .findJoinedActivities({ joinerId: req.user.id })
      .pipe(
        catchError((e) => {
          throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
        }),
        map((data) => eachInAll.parse(data)),
        toArray(),
      )
  }

  @Get('owned')
  @ApiResponse({
    schema: zodToOpenAPI(findAllActivityDto),
  })
  findOwnedActivities(@Req() req: AuthenticatedRequest) {
    return this.activityService
      .findOwnedActivities({ ownerId: req.user.id })
      .pipe(
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

  @Post('decline-join')
  @ApiResponse({
    schema: zodToOpenAPI(declineJoinResDtoSchema),
  })
  @UseZodGuard('body', DeclineJoin)
  declineJoin(@Body() data: DeclineJoin) {
    return this.activityService.declineJoin(data).pipe(
      catchError((e) => {
        throw new HttpException(e.details, HttpStatus.BAD_REQUEST)
      }),
      map((d) => declineJoinResDtoSchema.parse(d)),
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
  join(@Body() data: JoinActivity, @Req() req: AuthenticatedRequest) {
    return this.activityService.join({ ...data, joinerId: req.user.id }).pipe(
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
  create(@Body() data: CreateActivity, @Req() req: AuthenticatedRequest) {
    return this.activityService.create({ ...data, ownerId: req.user.id }).pipe(
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

  @Get(':activityId')
  @ApiResponse({
    schema: {
      oneOf: [findOneByOwner, findOneByNotOwner].map(zodToOpenAPI),
    },
  })
  findOne(@Param('activityId') id: string, @Req() req: AuthenticatedRequest) {
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

        if (ownerId === req.user.id) {
          const dto: FindOneByOwner = {
            joinedUsers,
            ownerId,
            pendingUsers: (await findUsers(pendingUserIds)).map(
              makeActivityUser,
            ),
            ownerName: owner.name,
            status: 'owned',
            ...rest,
          }
          return dto
        }

        const status: keyof typeof ActivityStatus = joinedUserIds.includes(
          req.user.id,
        )
          ? 'joined'
          : pendingUserIds.includes(req.user.id)
          ? 'pending'
          : 'not-joined'

        const dto: FindOneByNotOwner = {
          joinedUsers,
          ownerId,
          ownerName: owner.name,
          status,
          ...rest,
        }
        return dto
      }),
    )
  }
}
