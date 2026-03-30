import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Course, CourseDocument } from './schema/course-schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectModel } from '@nestjs/mongoose';

/**
 * @class CourseServices
 * @description Handles course-related operations.
 * @version 1.0
 * @path /api/v1/courses
 */
@Injectable()
export class CourseServices {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /**
   * @method getCourses
   * @description handles fetching all courses.
   */
  async getCourses() {
    const courses = await this.courseModel.find({});

    return courses;
  }

  /**
   * @method createCourse
   * @description handles creating a new course.
   */
  async createCourse(courseData: CreateCourseDto) {
    const course = new this.courseModel(courseData);

    return await course.save();
  }
}
