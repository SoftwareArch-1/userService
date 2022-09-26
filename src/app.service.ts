import { prismaClient } from 'prisma/script'

import { HttpException, Injectable } from '@nestjs/common'

import { ReviewService } from './review/review.service'

@Injectable()
export class AppService {
  constructor(private readonly reviewService: ReviewService) {}

  getHello(): string {
    return 'Hello World!'
  }

  async getProfile(userId: string) {
    // maybe put this in the user service
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
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
        revieweeId: userId,
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

    const stars = await this.reviewService.countReviewStars(reviews)

    return {
      reviews,
      stars,
      profile: user,
    }
  }
}
