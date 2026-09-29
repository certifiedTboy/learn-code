import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from "../common/mailer/mailer.service";
import { CourseServices } from "../course/course-services";
export declare class QueueWorker extends WorkerHost {
    private readonly emailService;
    private readonly courseServices;
    constructor(emailService: EmailService, courseServices: CourseServices);
    process(job: Job<any, any, string>): Promise<any>;
    onFailed(job: Job): void;
}
