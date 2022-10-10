import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ReviewModule } from './review/review.module'
import { AppService } from './app.service'
import { ReviewService } from './review/review.service'
import { AuthController } from './auth/auth.controller'
import { LocalStrategy } from './auth/strategies/local.strategy'

@Module({
  imports: [UserModule, AuthModule, ReviewModule, AppModule],
  controllers: [AppController],
  providers: [AppService, ReviewService, LocalStrategy],
})
export class AppModule {}
