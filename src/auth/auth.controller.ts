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
import { createZodDto, UseZodGuard } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

class LoginDto extends createZodDto(
  z.object({
    username: z.string().email(),
    password: z.string(),
  }),
) {}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseZodGuard('body', LoginDto)
  @Post('login')
  async login(
    @Req() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _: LoginDto /* required to show in swagger */,
  ) {
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
