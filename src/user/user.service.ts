import * as bcrypt from 'bcrypt'
import { userSchema } from 'prisma/zod-models/user.entity'
import { ReviewService } from 'src/review/review.service'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { prismaClient } from '../../prisma/script'
import { CreateUserDto } from './dto/create-user.dto'
import {
  findOneUserResponseDto,
  FindOneUserResponseDto,
} from './dto/find-one-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { stripPassword } from './utils/stripPassword'

@Injectable()
export class UserService {
  constructor(private readonly reviewService: ReviewService) {}

  async create({ password, ...rest }: CreateUserDto) {
    try {
      const createdUser = await prismaClient.user.create({
        data: {
          password: bcrypt.hashSync(password, 10),
          ...rest,
        },
      })
      return stripPassword(createdUser)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    const users = await prismaClient.user.findMany()
    return users
  }

  async findOne(id: string): Promise<FindOneUserResponseDto> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        surname: true,
        email: true,
        id: true,
      },
    })

    if (!user) {
      throw new HttpException('User not found', 404)
    }

    const reviews = await prismaClient.review.findMany({
      where: {
        revieweeId: id,
      },
      select: {
        id: true,
        content: true,
        stars: true,
        reviewer: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    })

    const stars = this.reviewService.countReviewStars(reviews)

    return findOneUserResponseDto.parse({
      reviews,
      stars,
      profile: user,
    })
  }

  update(id: string, { password, ...rest }: UpdateUserDto) {
    const user = prismaClient.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
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
    try {
      const deleteUsers = prismaClient.user.deleteMany({
        where: {
          id: id,
        },
      })
      return deleteUsers
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
