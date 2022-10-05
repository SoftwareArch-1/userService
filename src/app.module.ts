import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ReviewModule } from './review/review.module'
import { ActivityModule } from './sync_with_activity/activity.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, ActivityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
