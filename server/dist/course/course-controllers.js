"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const common_2 = require("@nestjs/common");
const response_handler_1 = require("../common/response-handler/response-handler");
const course_services_1 = require("./course-services");
const create_course_dto_1 = require("./dto/create-course.dto");
const auth_guard_1 = require("../guard/auth-guard");
let CourseControllers = class CourseControllers {
    courseService;
    configService;
    logger;
    clientType = '';
    constructor(courseService, configService, logger) {
        this.courseService = courseService;
        this.configService = configService;
        this.logger = logger;
    }
    async getAllCourses(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Fetching all courses',
                clientType: this.clientType,
            });
            const courses = await this.courseService.getCourses();
            return response_handler_1.ResponseHandler.ok(200, 'Courses retrieved successfully', courses);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async getRegisteredCoursesByUser(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Fetching registered courses by user',
                clientType: this.clientType,
            });
            const userId = req.user._id;
            const courses = await this.courseService.getRegisteredCourses(userId);
            return response_handler_1.ResponseHandler.ok(200, 'Registered courses retrieved successfully', courses);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async createCourse(req, createCourseDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Creating a new course',
                clientType: this.clientType,
            });
            const createdCourse = await this.courseService.createCourse(createCourseDto);
            if (createdCourse) {
                return response_handler_1.ResponseHandler.ok(200, 'Course created successfully', createdCourse);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async updateCourse(createCourseDto, req) {
        const { id } = req.params;
        try {
            if (id && Array.isArray(id))
                throw new common_2.BadRequestException('Invalid course ID');
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: `Updating course with id ${id}`,
                clientType: this.clientType,
            });
            const updatedCourse = await this.courseService.updateCourseById(createCourseDto, id);
            if (updatedCourse) {
                return response_handler_1.ResponseHandler.ok(200, 'Course updated successfully', updatedCourse);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async deleteCourse(req) {
        const { id } = req.params;
        if (id && Array.isArray(id))
            throw new common_2.BadRequestException('Invalid course ID');
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: `Deleting course with id ${id}`,
                clientType: this.clientType,
            });
            await this.courseService.deleteCourseById(id);
            return response_handler_1.ResponseHandler.ok(200, 'Course deleted successfully', {});
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async paystackSuccessPayment(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Processing Paystack payment webhook',
                clientType: this.clientType || 'mobile',
            });
            const signature = req.headers['x-paystack-signature'];
            const result = await this.courseService.verifyPaystackPayment(req.body, signature);
            response_handler_1.ResponseHandler.ok(200, 'Payment verified successfully', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType || 'mobile',
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async handleFlutterwaveSuccessPayment(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Processing Flutterwave payment webhook',
                clientType: this.clientType || 'mobile',
            });
            const result = await this.courseService.verifyFlutterwavePayment(req.body.id);
            response_handler_1.ResponseHandler.ok(200, 'Payment verified successfully', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType || 'mobile',
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async updateRegisteredCourseProgress(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Updating registered course progress',
                clientType: this.clientType,
            });
            const result = await this.courseService.addCourseProgressUpdateToQueue(req.body.courses, req.user._id);
            response_handler_1.ResponseHandler.ok(200, 'Course progress updated successfully', {});
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
};
exports.CourseControllers = CourseControllers;
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('registered-courses'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "getRegisteredCoursesByUser", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "createCourse", null);
__decorate([
    (0, common_1.Put)(':id/update'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)(':id/delete'),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.Post)('payment/webhook'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "paystackSuccessPayment", null);
__decorate([
    (0, common_1.Post)('payment/flutterwave/webhook'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "handleFlutterwaveSuccessPayment", null);
__decorate([
    (0, common_1.Put)('update-progress'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseControllers.prototype, "updateRegisteredCourseProgress", null);
exports.CourseControllers = CourseControllers = __decorate([
    (0, common_1.Controller)({
        path: 'courses',
        version: '1',
    }),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [course_services_1.CourseServices,
        config_1.ConfigService,
        winston_1.Logger])
], CourseControllers);
//# sourceMappingURL=course-controllers.js.map