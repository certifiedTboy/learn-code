import { ConfigService } from '@nestjs/config';
import { Course, CourseDocument } from './schema/course-schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UsersService } from '../user/users-service';
import { QueueService } from '../queue/queue-service';
export declare class CourseServices {
    private courseModel;
    private configService;
    private usersService;
    private queueService;
    private FLUTTERWAVE_PUBLIC_KEY;
    private PAYSTACK_SECRET;
    private FLUTTERWAVE_SECRET_KEY;
    private WEBHOOK_SECRET;
    constructor(courseModel: Model<CourseDocument>, configService: ConfigService, usersService: UsersService, queueService: QueueService);
    getCourses(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createCourse(courseData: CreateCourseDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateCourseById(courseData: CreateCourseDto, id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    handleSuccessPayment(courseId: string, userId: string, paymentId: number | string, courseName: string, amount: number): Promise<(import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    deleteCourseById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    verifyFlutterwavePayment(transactionId: string | number): Promise<(import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    verifyPaystackPayment(paymentData: any, paystackSignature: string): Promise<(import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    getRegisteredCourses(userId: string): Promise<{
        course: import("mongoose").Types.ObjectId;
        paymentId: number | string;
        dateRegistered: Date;
        completion: string;
    }[]>;
    addCourseProgressUpdateToQueue(courseData: any[], userId: string): Promise<void>;
    updateCourseProgress(courseData: any[], userId: string): Promise<void>;
}
