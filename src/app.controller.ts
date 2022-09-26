import { stripPassword } from './user/utils/stripPassword'
import { ReviewService } from './review/review.service'
import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { SafeOmit } from './user/utils/types'
import { Review, User } from '@prisma/client'
import { UseZodGuard } from 'nestjs-zod'
import { UserService } from './user/user.service'
import { Param } from '@nestjs/common/decorators/http/route-params.decorator'
import { prismaClient } from 'prisma/script'

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() req) {
    return this.authService.login(req)
  }
  // @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id') id: string): Promise<{
    user: {
      email: string
      name: string
      surname: string
    }
    reviews: {
      content: string
      stars: number
      id: string
      reviewer: {
        name: string
        surname: string
      }
    }[]
    stars: Awaited<ReturnType<ReviewService['countReviewStars']>>
  }> {
    // maybe put this in the user service
    const { reviews, name, email, surname } =
      await prismaClient.user.findUniqueOrThrow({
        where: { id },
        include: {
          reviews: {
            select: {
              stars: true,
              content: true,
              id: true,
              reviewer: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
      })

    const stars = await this.reviewService.countReviewStars(reviews)

    return {
      reviews,
      stars,
      user: { name, email, surname },
    }
  }
}
