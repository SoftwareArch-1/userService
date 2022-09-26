import { prismaClient } from 'prisma/script'

import { Injectable } from '@nestjs/common'

import { CreateReviewDto } from './dto/createReview.dto'
import { CreateReviewResponseDto } from './dto/createReviewResponse.dto'

@Injectable()
export class ReviewService {
  async create({
    content,
    revieweeId,
    stars,
    reviewerId,
  }: CreateReviewDto & {
    reviewerId: string // from request object
  }): Promise<CreateReviewResponseDto> {
    await prismaClient.user.update({
      where: {
        id: reviewerId,
      },
      data: {
        reviews: {
          create: {
            content,
            stars,
            revieweeId,
          },
        },
      },
    })
    return '👌'
  }

  countReviewStars(reviews: { stars: number }[]): {
    1: number
    2: number
    3: number
    4: number
    5: number
  } {
    const result = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    if (!reviews) {
      return result
    }

    reviews.forEach(({ stars }) => {
      result[stars]++
    })

    return result
  }
}
