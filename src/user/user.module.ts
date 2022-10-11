import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ReviewModule } from 'src/review/review.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [ReviewModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
