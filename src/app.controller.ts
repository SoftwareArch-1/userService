import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  HttpException,
} from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { SafeOmit } from './user/utils/types'
import { Review, User } from '@prisma/client'
import { UseZodGuard } from 'nestjs-zod'
import { UserService } from './user/user.service'
import { Param } from '@nestjs/common/decorators/http/route-params.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() req) {
    return this.authService.login(req)
  }
}
