import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationMail(
    to: string,
    subject: string,
    verificationCode: string,
    firstName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'verification-code',
        context: {
          verificationCode,
          firstName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async sendPasswordResetMail(
    to: string,
    subject: string,
    passwordResetCode: string,
    firstName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'password-reset-code',
        context: {
          passwordResetCode,
          firstName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async sendPasswordChangeSuccessMail(
    to: string,
    subject: string,
    firstName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'password-reset-success',
        context: {
          firstName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async sendAccountSetupSuccessMail(
    to: string,
    subject: string,
    firstName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'account-setup-success',
        context: {
          firstName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async newProjectMail(
    to: string,
    subject: string,
    firstName: string,
    companyName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'new-project',
        context: {
          firstName,
          companyName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async projectUpdateMail(to: string, subject: string, firstName: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'project-update',
        context: {
          firstName,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async paymentSuccessMail(
    to: string,
    subject: string,
    firstName: string,
    amount: string,
    paymentId: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'payment-success',
        context: {
          firstName,
          amount,
          paymentId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async sendTicketCreatedEmail(
    to: string,
    subject: string,
    firstName: string,
    businessName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'new-ticket',
        context: { firstName, businessName },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async sendTicketUpdatedEmail(
    to: string,
    subject: string,
    firstName: string,
    status: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: 'ticket-status-update',
        context: { firstName, status },
      });
    } catch (error: unknown) {
      console.log(error);
    }
  }
}
