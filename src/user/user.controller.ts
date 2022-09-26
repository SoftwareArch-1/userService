import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'

import {
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { CreateUserDto } from './dto/create-user.dto'
import {
  findOneUserResponseDto,
  FindOneUserResponseDto,
} from './dto/find-one-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseZodGuard('body', CreateUserDto)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll()
  // }

  @Get(':id')
  @ApiResponse({
    schema: zodToOpenAPI(findOneUserResponseDto),
  })
  findOne(@Param('id') id: string): Promise<FindOneUserResponseDto> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @UseZodGuard('body', UpdateUserDto)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(id)
  // }
}
