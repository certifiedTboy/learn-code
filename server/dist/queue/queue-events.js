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
exports.AppQueueEventsListener = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let AppQueueEventsListener = class AppQueueEventsListener extends bullmq_1.QueueEventsHost {
    logger = new common_1.Logger('Queue');
    onAdded(job) {
        this.logger.log(`Job ${job.jobId} has been added to the queue`);
    }
};
exports.AppQueueEventsListener = AppQueueEventsListener;
__decorate([
    (0, bullmq_1.OnQueueEvent)('added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppQueueEventsListener.prototype, "onAdded", null);
exports.AppQueueEventsListener = AppQueueEventsListener = __decorate([
    (0, bullmq_1.QueueEventsListener)('appQueue')
], AppQueueEventsListener);
//# sourceMappingURL=queue-events.js.map