import * as bcrypt from 'bcrypt'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { IdT } from '../entities/base.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserT } from './entities/user.entity'
import { genId } from './utils/genId'
import { SafeOmit } from './utils/types'
import { stripPassword } from './utils/stripPassword'

import { prismaClient } from '../../prisma/script'

@Injectable()
export class UserService {
  create({ password, ...rest }: CreateUserDto) {
    const createdUser = prismaClient.user.create({
      data: {
        password: bcrypt.hashSync(password, 10),
        ...rest,
      },
    })

    return createdUser
  }

  findAll() {
    const users = prismaClient.user.findMany()
    return users
  }

  findOne(id: IdT) {
    //find in prisma
    const user = prismaClient.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }

  update(id: IdT, { password, ...rest }: UpdateUserDto) {
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

  remove(id: IdT) {
    const deleteUsers = prismaClient.user.deleteMany({
      where: {
        id: id,
      },
    })
    return deleteUsers
  }
}
