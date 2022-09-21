import * as bcrypt from 'bcrypt'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SafeOmit } from './utils/types'
import { stripPassword } from './utils/stripPassword'

import { prismaClient } from '../../prisma/script'

@Injectable()
export class UserService {
  async create({ password, ...rest }: CreateUserDto) {
    const createdUser = await prismaClient.user.create({
      data: {
        password: bcrypt.hashSync(password, 10),
        ...rest,
      },
    })
    return stripPassword(createdUser)
  }

  async findAll() {
    const users = await prismaClient.user.findMany()
    return users
  }

  async findOne(id: string) {
    //find in prisma
    const user = await prismaClient.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return stripPassword(user)
  }

  update(id: string, { password, ...rest }: UpdateUserDto) {
    const user = prismaClient.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    if (password) {
      return prismaClient.user.update({
        where: {
          id: id,
        },
        data: {
          password: bcrypt.hashSync(password, 10),
        },
      })
    } else
      return prismaClient.user.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
        },
      })
  }

  remove(id: string) {
    const deleteUsers = prismaClient.user.deleteMany({
      where: {
        id: id,
      },
    })
    return deleteUsers
  }
}
