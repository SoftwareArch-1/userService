import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { prismaClient } from 'prisma/script'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from '../user/user.service'
import { SafeOmit } from '../user/utils/types'
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { stripPassword } from 'src/user/utils/stripPassword'
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return stripPassword(user)
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email }

    return {
      user: await this.userService.findMe(user.email),
      access_token: this.jwtService.sign(payload),
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const uid = await this.jwtService.verify(token).uid
      const findUser = prismaClient.user.findUnique({
        where: {
          id: uid,
        },
      })
    } catch (error) {
      return
    }
  }
}
