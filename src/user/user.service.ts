import bcrypt from 'bcrypt'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { IdT } from '../entities/base.entity'
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

    // has password?
    // upload to db

    const userReturn: SafeOmit<UserT, 'password'> = {
      ...rest,
      id,
      createdAt: now,
      updatedAt: now,
    }

    return userReturn
  }

  findOne(id: IdT): SafeOmit<UserT, 'password'> {
    return {
      createdAt: new Date(),
      email: 'email@exmaple.com',
      id,
      name: 'name',
      updatedAt: new Date(),
    }
  }

  update(id: IdT, { password, ...rest }: UpdateUserDto) {
    const user = this._findOneWithPassword(id)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const updatedUser = { ...user, ...rest }

    if (password) {
      updatedUser.password = bcrypt.hashSync(password, 10)
    }

    return stripPassword(updatedUser)
  }

  remove(id: IdT) {
    // TODO: implement
  }

  private _findOneWithPassword(id: IdT): UserT | null {
    return null
  }
}
