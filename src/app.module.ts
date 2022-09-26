import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ReviewModule } from './review/review.module'
import { AppService } from './app.service'

@Module({
  imports: [UserModule, AuthModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
