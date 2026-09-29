import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { Request } from 'express';
import { CourseServices } from './course-services';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CourseControllers {
    private readonly courseService;
    private configService;
    private readonly logger;
    private clientType;
    constructor(courseService: CourseServices, configService: ConfigService, logger: Logger);
    getAllCourses(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    getRegisteredCoursesByUser(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    createCourse(req: Request, createCourseDto: CreateCourseDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
    updateCourse(createCourseDto: CreateCourseDto, req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
    deleteCourse(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    paystackSuccessPayment(req: Request): Promise<void>;
    handleFlutterwaveSuccessPayment(req: Request): Promise<void>;
    updateRegisteredCourseProgress(req: Request): Promise<void>;
}
