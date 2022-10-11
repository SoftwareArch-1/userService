import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { LocalStrategy } from './auth/strategies/local.strategy'
import { ReviewModule } from './review/review.module'
import { ReviewService } from './review/review.service'
import { ActivityModule } from './sync_with_activity/activity.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [UserModule, AuthModule, ReviewModule, AppModule, ActivityModule],
  controllers: [AppController],
  providers: [AppService, ReviewService, LocalStrategy],
})
export class AppModule {}
