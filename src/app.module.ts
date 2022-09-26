import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ReviewModule } from './review/review.module'

@Module({
  imports: [UserModule, AuthModule, ReviewModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
