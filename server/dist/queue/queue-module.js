"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const queue_service_1 = require("./queue-service");
const queue_worker_1 = require("./queue-worker");
const queue_events_1 = require("./queue-events");
const mailers_module_1 = require("../common/mailer/mailers.module");
const course_module_1 = require("../course/course-module");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'appQueue',
            }),
            mailers_module_1.MailersModule,
            course_module_1.CourseModule,
        ],
        providers: [queue_service_1.QueueService, queue_worker_1.QueueWorker, queue_events_1.AppQueueEventsListener],
        exports: [queue_service_1.QueueService],
    })
], QueueModule);
//# sourceMappingURL=queue-module.js.map