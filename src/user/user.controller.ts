import { idSchema, IdT } from './../entities/base.entity'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UseZodGuard } from 'nestjs-zod'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Post()
  @UseZodGuard('body', CreateUserDto)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get(':id')
  @UseZodGuard('params', idSchema)
  findOne(@Param('id') id: IdT) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @UseZodGuard('params', idSchema)
  @UseZodGuard('body', UpdateUserDto)
  update(@Param('id') id: IdT, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @UseZodGuard('params', idSchema)
  remove(@Param('id') id: IdT) {
    return this.userService.remove(id)
  }
}
