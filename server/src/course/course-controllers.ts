import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Res,
  // Headers,
  // RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { CourseServices } from './course-services';
import { CreateCourseDto } from './dto/create-course.dto';
import { AdminGuard, AuthGuard } from '../guard/auth-guard';

/**
 * @class CourseControllers
 * @description Handles all course-related HTTP requests.
 * This includes creating chat rooms and retrieving existing chat rooms.
 */
@Controller({
  path: 'courses',
  version: '1',
})
export class CourseControllers {
  constructor(
    private readonly courseService: CourseServices,
    private configService: ConfigService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAllCourses(@Req() req: Request) {
    try {
      // const { limit, skip } = ChatHelpers.getPaginationParams(page);
      const courses = await this.courseService.getCourses();

      return ResponseHandler.ok(200, 'Courses retrieved successfully', courses);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  /**
   * @method getRegisteredCourses
   */
  @Get('registered-courses')
  @UseGuards(AuthGuard)
  async getRegisteredCoursesByUser(@Req() req: Request) {
    try {
      const userId = req.user._id;
      const courses = await this.courseService.getRegisteredCourses(userId);

      return ResponseHandler.ok(
        200,
        'Registered courses retrieved successfully',
        courses,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Post('create')
  @UseGuards(AdminGuard)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      const createdCourse =
        await this.courseService.createCourse(createCourseDto);

      if (createdCourse) {
        return ResponseHandler.ok(
          200,
          'Course created successfully',
          createdCourse,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Put(':id/update')
  @UseGuards(AdminGuard)
  async updateCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: Request,
  ) {
    const { id } = req.params;
    try {
      if (id && Array.isArray(id))
        throw new BadRequestException('Invalid course ID');
      const updatedCourse = await this.courseService.updateCourseById(
        createCourseDto,
        id,
      );

      if (updatedCourse) {
        return ResponseHandler.ok(
          200,
          'Course updated successfully',
          updatedCourse,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Delete(':id/delete')
  @UseGuards(AdminGuard)
  async deleteCourse(@Req() req: Request) {
    const { id } = req.params;

    if (id && Array.isArray(id))
      throw new BadRequestException('Invalid course ID');

    try {
      await this.courseService.deleteCourseById(id);

      return ResponseHandler.ok(200, 'Course deleted successfully', {});
    } catch (error: unknown) {
      // console.log(error);
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  /**
   * @method handleSuccessPayment
   * @description Handles successful payment for a project.
   */
  @Post('payment/webhook')
  async paystackSuccessPayment(@Req() req: Request) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const result = await this.courseService.verifyPaystackPayment(
        req.body,
        signature,
      );

      ResponseHandler.ok(200, 'Payment verified successfully', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method handleSuccessPayment
   * @description Handles successful payment for a project.
   */
  @Post('payment/flutterwave/webhook')
  async handleFlutterwaveSuccessPayment(@Req() req: Request) {
    try {
      const result = await this.courseService.verifyFlutterwavePayment(
        req.body.id,
      );

      ResponseHandler.ok(200, 'Payment verified successfully', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method updateRegisteredCourseProgress
   * @description Updates the user's progress in a course.
   */
  @Put('update-progress')
  @UseGuards(AuthGuard)
  async updateRegisteredCourseProgress(@Req() req: Request) {
    try {
      const result = await this.courseService.addCourseProgressUpdateToQueue(
        req.body,
        req.user._id,
      );

      ResponseHandler.ok(200, 'Course progress updated successfully', {});
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }
}
