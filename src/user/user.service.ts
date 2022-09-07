import { Injectable } from '@nestjs/common'
import { IdT } from 'src/entities/base.entity'
import { db } from './db'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserT } from './entities/user.entity'
import { genId } from './utils/genId'

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto): UserT {
    const id = genId()
    const now = new Date()

    const user: UserT = {
      ...createUserDto,
      id,
      createdAt: now,
      updatedAt: now,
    }

    db.set(id, user)

    return user
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
