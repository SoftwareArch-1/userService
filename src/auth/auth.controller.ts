import {
  Res,
  Get,
  Req,
  Body,
  Post,
  HttpStatus,
  Controller,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { domainToASCII } from 'url'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    // this.authService.logout(req.cookies[process.env.TOKEN_NAME as string])
    // res.clearCookie(process.env.TOKEN_NAME as string, {
    //   sameSite: 'none',
    //   // secure: true,
    // })
    // // res.clearCookie(process.env.TOKEN_NAME);
    // res.status(HttpStatus.OK).json({ success: true })
  }
}
