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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueWorker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mailer_service_1 = require("../common/mailer/mailer.service");
const course_services_1 = require("../course/course-services");
let QueueWorker = class QueueWorker extends bullmq_1.WorkerHost {
    emailService;
    courseServices;
    constructor(emailService, courseServices) {
        super();
        this.emailService = emailService;
        this.courseServices = courseServices;
    }
    async process(job) {
        if (job.name === 'email-verification') {
            await this.emailService.sendVerificationMail(job?.data?.email, job?.data?.subject, job?.data?.verificationCode, job?.data?.firstName);
        }
        if (job.name === 'email-account-setup-success') {
            await this.emailService.sendAccountSetupSuccessMail(job?.data?.email, job?.data?.subject, job?.data?.firstName);
        }
        if (job.name === 'email-password-change-success') {
            await this.emailService.sendPasswordChangeSuccessMail(job?.data?.email, job?.data?.subject, job?.data?.firstName);
        }
        if (job.name === 'email-password-reset') {
            await this.emailService.sendPasswordResetMail(job?.data?.email, job?.data?.subject, job?.data?.passwordResetCode, job?.data?.firstName);
        }
        if (job.name === 'complete-course-payment') {
            await this.emailService.paymentSuccessMail(job?.data?.email, job?.data?.subject, job?.data?.firstName, job?.data?.amount, job?.data?.paymentId, job?.data?.courseName);
        }
        if (job.name === 'update-course-payment') {
            await this.emailService.paymentUpdateSuccessMail(job?.data?.email, job?.data?.subject, job?.data?.firstName, job?.data?.amount, job?.data?.paymentId, job?.data?.courseName);
        }
        if (job.name === 'update-course-progress') {
            const courseData = job?.data?.courseData;
            const userId = job?.data?.userId;
            await this.courseServices.updateCourseProgress(courseData, userId);
        }
    }
    onFailed(job) {
        console.log(`Job with id ${job.id} FAILED! Attempt Number ${job.attemptsMade}`);
    }
};
exports.QueueWorker = QueueWorker;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], QueueWorker.prototype, "onFailed", null);
exports.QueueWorker = QueueWorker = __decorate([
    (0, bullmq_1.Processor)('appQueue', { concurrency: 3 }),
    __metadata("design:paramtypes", [mailer_service_1.EmailService,
        course_services_1.CourseServices])
], QueueWorker);
//# sourceMappingURL=queue-worker.js.map