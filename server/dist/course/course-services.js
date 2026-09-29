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
exports.CourseServices = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const course_schema_1 = require("./schema/course-schema");
const crypto_1 = require("crypto");
const axios_1 = require("axios");
const mongoose_1 = require("mongoose");
const users_service_1 = require("../user/users-service");
const queue_service_1 = require("../queue/queue-service");
const mongoose_2 = require("@nestjs/mongoose");
let CourseServices = class CourseServices {
    courseModel;
    configService;
    usersService;
    queueService;
    FLUTTERWAVE_PUBLIC_KEY;
    PAYSTACK_SECRET;
    FLUTTERWAVE_SECRET_KEY;
    WEBHOOK_SECRET;
    constructor(courseModel, configService, usersService, queueService) {
        this.courseModel = courseModel;
        this.configService = configService;
        this.usersService = usersService;
        this.queueService = queueService;
        this.FLUTTERWAVE_PUBLIC_KEY = this.configService.get('FLUTTERWAVE_PUBLIC_KEY');
        this.FLUTTERWAVE_SECRET_KEY = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        this.WEBHOOK_SECRET = this.configService.get('WEBHOOK_SECRET');
        this.PAYSTACK_SECRET = this.configService.get('PAYSTACK_SECRET');
    }
    async getCourses() {
        const courses = await this.courseModel.find({});
        return courses;
    }
    async createCourse(courseData) {
        const course = new this.courseModel(courseData);
        return await course.save();
    }
    async updateCourseById(courseData, id) {
        const updatedCourse = await this.courseModel.findByIdAndUpdate(id, courseData, { new: true });
        return updatedCourse;
    }
    async handleSuccessPayment(courseId, userId, paymentId, courseName, amount) {
        const course = await this.courseModel.findById(courseId);
        const user = await this.usersService.checkUserExistById(userId);
        if (user && course) {
            const courseExists = user.registeredCourses.findIndex((course) => course.course.toString() === courseId);
            if (courseExists !== -1) {
                user.registeredCourses[courseExists].paymentId = paymentId;
                user.registeredCourses[courseExists].dateRegistered = new Date();
                await user.save();
                await this.queueService.addJob('update-course-payment', {
                    email: user.email,
                    subject: 'Course Payment Updated',
                    firstName: user?.firstName || user.email,
                    paymentId,
                    amount,
                    courseName,
                }, 10000);
                return user;
            }
            else {
                user.registeredCourses.push({
                    course: course._id,
                    paymentId: paymentId,
                    dateRegistered: new Date(),
                    completion: '0%',
                });
                course.subscribers += 1;
                await course.save();
                await user.save();
                await this.queueService.addJob('complete-course-payment', {
                    email: user.email,
                    subject: 'Course Payment Completed',
                    firstName: user?.firstName || user.email,
                    paymentId,
                    amount,
                    courseName,
                }, 10000);
                return user;
            }
        }
    }
    async deleteCourseById(id) {
        const deletedCourse = await this.courseModel.findByIdAndDelete(id);
        return deletedCourse;
    }
    async verifyFlutterwavePayment(transactionId) {
        const url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
        const response = await axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${this.FLUTTERWAVE_SECRET_KEY}`,
            },
        });
        if (response.data?.status !== 'success') {
            throw new common_1.BadRequestException('Flutterwave payment verification failed');
        }
        const result = await this.handleSuccessPayment(response?.data?.data?.meta?.courseId, response?.data?.data?.meta?.userId, response?.data?.data?.id, response?.data?.data?.meta?.courseName, response?.data?.data?.amount);
        return result;
    }
    async verifyPaystackPayment(paymentData, paystackSignature) {
        const hash = (0, crypto_1.createHmac)('sha512', this.PAYSTACK_SECRET)
            .update(JSON.stringify(paymentData))
            .digest('hex');
        if (hash == paystackSignature) {
            const userId = paymentData?.data?.metadata?.userId;
            const courseId = paymentData?.data?.metadata?.courseId;
            const paymentId = paymentData?.data?.id;
            const courseName = paymentData?.data?.metadata?.courseName;
            const amount = paymentData?.data?.amount;
            const result = await this.handleSuccessPayment(courseId, userId, paymentId, courseName, amount / 100);
            return result;
        }
    }
    async getRegisteredCourses(userId) {
        const user = await this.usersService.checkIfUserExist({ _id: userId });
        return user?.registeredCourses ?? [];
    }
    async addCourseProgressUpdateToQueue(courseData, userId) {
        const user = await this.usersService.checkUserExistById(userId);
        if (user) {
            this.queueService.addJob('update-course-progress', { courseData, userId }, 10000);
        }
    }
    async updateCourseProgress(courseData, userId) {
        try {
            const user = await this.usersService.checkUserExistById(userId);
            if (user) {
                const updatedRegisteredCourses = courseData?.map((course) => {
                    return {
                        course: course._id,
                        completion: course.completion,
                        paymentId: user.registeredCourses.find((registeredCourse) => registeredCourse.course.toString() === course._id)?.paymentId ?? '',
                        dateRegistered: new Date(course.dateRegistered),
                    };
                });
                user.registeredCourses = updatedRegisteredCourses;
                await user.save();
                console.log('Course progress updated successfully');
            }
        }
        catch (error) {
            console.error('Error updating course progress:', error);
        }
    }
};
exports.CourseServices = CourseServices;
exports.CourseServices = CourseServices = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        config_1.ConfigService,
        users_service_1.UsersService,
        queue_service_1.QueueService])
], CourseServices);
//# sourceMappingURL=course-services.js.map