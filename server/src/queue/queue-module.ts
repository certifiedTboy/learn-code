import { Global, Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue-service';
import { QueueWorker } from './queue-worker';
import { AppQueueEventsListener } from './queue-events';
import { MailersModule } from '../common/mailer/mailers.module';
import { CourseModule } from '../course/course-module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'appQueue',
    }),
    MailersModule,
    CourseModule,
  ],
  providers: [QueueService, QueueWorker, AppQueueEventsListener],
  exports: [QueueService],
})
export class QueueModule {}
