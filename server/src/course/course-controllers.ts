import { Controller, UseGuards, Req, Get, Post, Body } from '@nestjs/common';
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
@UseGuards(AuthGuard)
export class CourseControllers {
  constructor(private readonly courseService: CourseServices) {}

  @Get('')
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

  @Post('create')
  @UseGuards(AdminGuard)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    console.log(createCourseDto);
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
}
