import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() req) {
    return this.authService.login(req)
  }
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Body() req) {
    return req
  }
}
