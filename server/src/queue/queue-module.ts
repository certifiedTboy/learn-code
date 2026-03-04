import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue-service';
import { QueueWorker } from './queue-worker';
import { AppQueueEventsListener } from './queue-events';
import { MailersModule } from '../common/mailer/mailers.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'appQueue',
    }),
    MailersModule,
  ],
  providers: [QueueService, QueueWorker, AppQueueEventsListener],
  exports: [QueueService],
})
export class QueueModule {}
