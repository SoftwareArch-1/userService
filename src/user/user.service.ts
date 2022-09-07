import bcrypt from 'bcrypt'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { IdT } from '../entities/base.entity'
import { db } from './db'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserT } from './entities/user.entity'
import { genId } from './utils/genId'
import { SafeOmit } from './utils/types'
import { stripPassword } from './utils/stripPassword'

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

  findOne(id: IdT): SafeOmit<UserT, 'password'> {
    return stripPassword(this._findOneWithPassword(id))
  }

  update(id: IdT, { password, ...rest }: UpdateUserDto) {
    const user = this._findOneWithPassword(id)
    const updatedUser = { ...user, ...rest }

    if (password) {
      updatedUser.password = bcrypt.hashSync(password, 10)
    }

    db.set(id, updatedUser)

    return stripPassword(updatedUser)
  }

  remove(id: IdT) {
    return `This action removes a #${id} user`
  }

  private _findOneWithPassword(id: IdT): UserT {
    const user = db.get(id)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }
}
