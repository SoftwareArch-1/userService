import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'
import { toArray } from 'rxjs/operators'

import { OnModuleInit } from '@nestjs/common'
import { Controller, Get, Inject, Post } from '@nestjs/common/decorators'
import { ClientGrpc } from '@nestjs/microservices'
import { ApiResponse } from '@nestjs/swagger'

import { ActivityService, CreateActivity } from './activity.proto.interface'
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
  create(data: CreateActivity) {
    return this.activityService.create(data)
  }

  @Get()
  @ApiResponse({
    schema: zodToOpenAPI(ActivityModel.array()),
  })
  findAll() {
    const stream = this.activityService.findMany({})
    return stream.pipe(toArray())
  }

  @Get(':id')
  @ApiResponse({
    schema: zodToOpenAPI(ActivityModel),
  })
  findOne(id: string) {
    return this.activityService.findOne({ id })
  }
}
