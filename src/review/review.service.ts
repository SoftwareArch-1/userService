import { Injectable } from '@nestjs/common'
import { prismaClient } from 'prisma/script'
import { CreateReviewDto } from './dto/createReview.dto'

@Injectable()
export class ReviewService {
  async create({
    content,
    revieweeId,
    stars,
    reviewerId,
  }: CreateReviewDto & {
    reviewerId: string // from request object
  }) {
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

  async countReviewStars(reviews: { stars: number }[]): Promise<{
    1: number
    2: number
    3: number
    4: number
    5: number
  }> {
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
