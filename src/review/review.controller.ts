import { Body, Controller, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { UseZodGuard } from 'nestjs-zod'
import { CreateReviewDto } from './dto/createReview.dto'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseZodGuard('body', CreateReviewDto)
  create(@Req() req: Request, @Body() body: CreateReviewDto) {
    return this.reviewService.create({
      ...body,
      reviewerId: '' /* req.user?.id */,
    })
  }
}
