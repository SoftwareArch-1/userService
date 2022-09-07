import { Injectable } from '@nestjs/common'
import { IdT } from 'src/entities/base.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
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
