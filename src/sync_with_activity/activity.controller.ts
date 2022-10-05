import { OnModuleInit } from '@nestjs/common'
import { Controller, Get, Inject } from '@nestjs/common/decorators'
import { ClientGrpc } from '@nestjs/microservices'
import { toArray } from 'rxjs/operators'

import { ActivityService } from './activity.proto.interface'

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

  @Get()
  findAll() {
    const stream = this.activityService.findMany({})
    return stream.pipe(toArray())
  }

  @Get(':id')
  findOne(id: string) {
    return this.activityService.findOne({ id })
  }
}
