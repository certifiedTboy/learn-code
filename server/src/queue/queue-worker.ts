import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/common/mailer/mailer.service';
import { CourseServices } from 'src/course/course-services';

@Processor('appQueue', { concurrency: 3 }) // Can run up to 3 jobs concurrently
export class QueueWorker extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    private readonly courseServices: CourseServices,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'email-verification') {
      await this.emailService.sendVerificationMail(
        job?.data?.email!,
        job?.data?.subject!,
        job?.data?.verificationCode!,
        job?.data?.firstName!,
      );
    }
    if (job.name === 'email-account-setup-success') {
      await this.emailService.sendAccountSetupSuccessMail(
        job?.data?.email!,
        job?.data?.subject!,
        job?.data?.firstName!,
      );
    }
    if (job.name === 'email-password-change-success') {
      await this.emailService.sendPasswordChangeSuccessMail(
        job?.data?.email!,
        job?.data?.subject!,
        job?.data?.firstName!,
      );
    }
    if (job.name === 'email-password-reset') {
      await this.emailService.sendPasswordResetMail(
        job?.data?.email!,
        job?.data?.subject!,
        job?.data?.passwordResetCode!,
        job?.data?.firstName!,
      );
    }

    if (job.name === 'update-course-progress') {
      const courseData = job?.data?.courseData;
      const userId = job?.data?.userId;

      await this.courseServices.updateCourseProgress(courseData, userId);
    }
  }

  //  @OnWorkerEvent('active')
  // onActive(job: Job) {
  //   console.log(`Processing job with id ${job.id}`);
  // }

  // @OnWorkerEvent('completed')
  // onCompleted(job: Job) {
  //   console.log(`Job with id ${job.id} COMPLETED!`);
  // }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(
      `Job with id ${job.id} FAILED! Attempt Number ${job.attemptsMade}`,
    );
  }
}
