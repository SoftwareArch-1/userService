import bcrypt from 'bcrypt'

import { Injectable } from '@nestjs/common'

import { IdT } from '../entities/base.entity'
import { db } from './db'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserT } from './entities/user.entity'
import { genId } from './utils/genId'
import { SafeOmit } from './utils/types'

@Injectable()
export class UserService {
  create({ password, ...rest }: CreateUserDto): SafeOmit<UserT, 'password'> {
    const id = genId()
    const now = new Date()

    const userReturn: SafeOmit<UserT, 'password'> = {
      ...rest,
      id,
      createdAt: now,
      updatedAt: now,
    }

    db.set(id, {
      ...userReturn,
      password: bcrypt.hashSync(password, 10),
    })

    return userReturn
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: IdT) {
    return `This action returns a #${id} user`
  }

  update(id: IdT, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: IdT) {
    return `This action removes a #${id} user`
  }
}
