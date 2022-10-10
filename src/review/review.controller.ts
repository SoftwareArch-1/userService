import { UseZodGuard, zodToOpenAPI } from 'nestjs-zod'

import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateReviewDto } from './dto/createReview.dto'
import {
  CreateReviewResponseDto,
  createReviewResponseDtoSchema,
} from './dto/createReviewResponse.dto'
import { ReviewService } from './review.service'

@Controller('review')
@ApiTags('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseZodGuard('body', CreateReviewDto)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    schema: { ...zodToOpenAPI(createReviewResponseDtoSchema), example: '👌' },
    status: HttpStatus.CREATED,
  })
  async create(
    @Body() body: CreateReviewDto,
  ): Promise<CreateReviewResponseDto> {
    return createReviewResponseDtoSchema.parse(
      await this.reviewService.create({
        ...body,
        reviewerId: '' /* req.user?.id */,
      }),
    )
  }
}
