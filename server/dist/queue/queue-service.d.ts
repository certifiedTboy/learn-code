import { Queue } from 'bullmq';
export declare class QueueService {
    private readonly userQueue;
    constructor(userQueue: Queue);
    addJob(name: string, data: any, delay: number): Promise<import("bullmq").Job<any, any, string>>;
}
