import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { prismaClient } from 'prisma/script'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from '../user/user.service'
import { SafeOmit } from '../user/utils/types'
import { Prisma } from '@prisma/client'
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    return {
      id: 1,
      email: email,
      password: pass,
    }
    // const user = await this.userService.findOne(email)
    // //validate password
    // if (user && user.email === pass) {
    //   return user
    // }
    // return null
  }

  async login(reqUser: any) {
    console.log(reqUser)
    const payload = { username: reqUser.email, sub: reqUser.id }

    const findUser = await prismaClient.user.findUnique({
      where: {
        email: reqUser.email,
      },
    })
    if (!findUser) {
      throw new BadRequestException('The username or password is incorrect!')
    }
    //TODO: fix this prisma type problem
    const isPassValid = await compare(reqUser.password, findUser.password)

    if (!isPassValid) {
      throw new BadRequestException('The username or password is incorrect!')
    }

    return {
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
