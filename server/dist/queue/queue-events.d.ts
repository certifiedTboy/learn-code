import { QueueEventsHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
export declare class AppQueueEventsListener extends QueueEventsHost {
    logger: Logger;
    onAdded(job: {
        jobId: string;
        name: string;
    }): void;
}
