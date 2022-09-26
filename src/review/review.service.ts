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
        id: revieweeId,
      },
      data: {
        reviews: {
          create: {
            content,
            stars,
            reviewerId,
          },
        },
      },
    })
    return '👌'
  }
}
