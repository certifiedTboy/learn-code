import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlutterwavePaymentDto } from './dto/flutterwave-payment.dto';
import { Course, CourseDocument } from './schema/course-schema';
import { createHmac } from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UsersService } from '../user/users-service';
import { InjectModel } from '@nestjs/mongoose';

/**
 * @class CourseServices
 * @description Handles course-related operations.
 * @version 1.0
 * @path /api/v1/courses
 */
@Injectable()
export class CourseServices {
  private FLUTTERWAVE_PUBLIC_KEY: string;
  private PAYSTACK_SECRET: string;
  private FLUTTERWAVE_SECRET_KEY: string;
  private WEBHOOK_SECRET: string;

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.FLUTTERWAVE_PUBLIC_KEY = this.configService.get<string>(
      'FLUTTERWAVE_PUBLIC_KEY',
    )!;
    this.FLUTTERWAVE_SECRET_KEY = this.configService.get<string>(
      'FLUTTERWAVE_SECRET_KEY',
    )!;
    this.WEBHOOK_SECRET = this.configService.get<string>('WEBHOOK_SECRET')!;
    this.PAYSTACK_SECRET = this.configService.get<string>('PAYSTACK_SECRET')!;
  }

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

  /**
   * @method updateCourseById
   * @description handles course update by the provided id
   */
  async updateCourseById(courseData: CreateCourseDto, id: string) {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      courseData,
      { new: true },
    );

    return updatedCourse;
  }

  /**
   * @method handleSuccessPayment
   * @description handles the necessary operations after successful payment verification
   */
  async handleSuccessPayment(
    courseId: string,
    userId: string,
    paymentId: number | string,
  ) {
    const course = await this.courseModel.findById(courseId);
    const user = await this.usersService.checkUserExistById(userId);


    if (user && course) {
      const courseExists = user.registeredCourses.findIndex(
        (course: any) => course.course.toString() === courseId,
      );

      if (courseExists !== -1) {
        user.registeredCourses[courseExists].paymentId = paymentId;
        user.registeredCourses[courseExists].dateRegistered = new Date();
        await user.save();

        return user;
      } else {
        user.registeredCourses.push({
          course: course._id,
          paymentId: paymentId,
          dateRegistered: new Date(),
          completion: '0%',
        });
        course.subscribers += 1;
        await course.save();
        await user.save();

        return user;
      }
    }
  }

  /**
   * @method deleteCourseById
   * @description handles deletion of course by the provided id
   */
  async deleteCourseById(id: string) {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id);

    return deletedCourse;
  }

  /**
   * @method verifyFlutterwavePayment
   */
  async verifyFlutterwavePayment(transactionId: string | number) {
    const url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;

    interface FlutterwaveVerifyResponse {
      status: string;
      data: any;
    }

    const response: AxiosResponse<FlutterwaveVerifyResponse> = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${this.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    if (response.data?.status !== 'success') {
      throw new BadRequestException('Flutterwave payment verification failed');
    }

    const result = await this.handleSuccessPayment(
      response?.data?.data?.meta?.courseId,
      response?.data?.data?.meta?.userId,
      response?.data?.data?.id,
    );

    return result;
  }

  /**
   * @method verifyPaystackPayment
   * @description Verifies Paystack payment using the provided payment details.
   */
  async verifyPaystackPayment(paymentData: any, paystackSignature: string) {
    const hash = createHmac('sha512', this.PAYSTACK_SECRET)
      .update(JSON.stringify(paymentData))
      .digest('hex');

    if (hash == paystackSignature) {
      const userId = paymentData?.data?.metadata?.userId;
      const courseId = paymentData?.data?.metadata?.courseId;
      const paymentId = paymentData?.data?.id;

      const result = await this.handleSuccessPayment(
        courseId,
        userId,
        paymentId,
      );

      return result;
    }
  }
}
