import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'
import { strippedPasswordUserSchema } from 'prisma/zod-models/user.entity'

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { CreateUserDto } from './dto/create-user.dto'
import {
  findOneUserResponseDto,
  FindOneUserResponseDto,
} from './dto/find-one-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import { HttpStatus } from '@nestjs/common/enums'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseZodGuard('body', CreateUserDto)
  @ApiResponse({
    schema: zodToOpenAPI(strippedPasswordUserSchema),
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return strippedPasswordUserSchema.parse(
      await this.userService.create(createUserDto),
    )
  }

  @Get('all')
  findAll() {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    schema: zodToOpenAPI(findOneUserResponseDto),
  })
  async findOne(@Param('id') id: string): Promise<FindOneUserResponseDto> {
    return findOneUserResponseDto.parse(await this.userService.findOne(id))
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    schema: zodToOpenAPI(findOneUserResponseDto),
  })
  async findMe(@Req() req): Promise<FindOneUserResponseDto> {
    return findOneUserResponseDto.parse(
      await this.userService.findMe(req.user.email),
    )
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
