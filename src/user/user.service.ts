import * as bcrypt from 'bcrypt'
import { ReviewService } from 'src/review/review.service'

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'

import { prismaClient } from '../../prisma/script'
import { CreateUserDto } from './dto/create-user.dto'
import { FindOneUserResponseDto } from './dto/find-one-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { stripPassword } from './utils/stripPassword'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class UserService {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create({ email, password, ...rest }: CreateUserDto) {
    try {
      const createdUser = await prismaClient.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          ...rest,
        },
      })
      return this.authService.login(createdUser)
      // return stripPassword(createdUser)
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
        discordId: true,
        lineId: true,
        description: true,
        birthDate: true,
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
        createdAt: true,
        reviewer: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    })

    const stars = this.reviewService.countReviewStars(reviews)

    return {
      reviews,
      stars,
      profile: { ...user, birthDate: new Date(user.birthDate) },
    }
  }

  async findMe(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })

    if (!user) {
      throw new HttpException('User not found', 404)
    }

    return await this.findOne(user.id)
  }

  async findOneByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })
    return user
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
      const deleteUsers = prismaClient.user.delete({
        where: {
          id: id,
        },
      })
      return deleteUsers
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
