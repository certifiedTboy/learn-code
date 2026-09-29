import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignatureV4 } from '@smithy/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@smithy/protocol-http';
// import { defaultProvider } from '@aws-sdk/credential-provider-node';
import axios from 'axios';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  AWS_LAMBDA_URL: string;
  AWS_REGION: string;
  AWS_USER_ACCESS_KEY: string;
  AWS_USER_SECRET_ACCESS_KEY: string;
  constructor(
    // private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.AWS_LAMBDA_URL = this.configService.get<string>('AWS_LAMBDA_URL')!;
    this.AWS_REGION = this.configService.get<string>('AWS_REGION')!;
    this.AWS_USER_ACCESS_KEY = this.configService.get<string>(
      'AWS_USER_ACCESS_KEY',
    )!;

    this.AWS_USER_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_USER_SECRET_ACCESS_KEY',
    )!;
  }

  async sendVerificationMail(
    to: string,
    subject: string,
    verificationCode: string,
    firstName: string,
  ) {
    try {
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { verificationCode, firstName },
        'verification-code',
      );
      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'verification-code',
      //   context: {
      //     verificationCode,
      //     firstName,
      //   },
      // });
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
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { passwordResetCode, firstName },
        'password-reset-code',
      );
      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'password-reset-code',
      //   context: {
      //     passwordResetCode,
      //     firstName,
      //   },
      // });
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
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { firstName },
        'password-reset-success',
      );
      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'password-reset-success',
      //   context: {
      //     firstName,
      //   },
      // });
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
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { firstName },
        'account-setup-success',
      );

      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'account-setup-success',
      //   context: {
      //     firstName,
      //   },
      // });
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
    courseName: string,
  ) {
    try {
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { firstName, amount, paymentId, courseName },
        'payment-success',
      );

      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'payment-success',
      //   context: {
      //     firstName,
      //     amount,
      //     paymentId,
      //     courseName,
      //   },
      // });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async paymentUpdateSuccessMail(
    to: string,
    subject: string,
    firstName: string,
    amount: string,
    paymentId: string,
    courseName: string,
  ) {
    try {
      await this.sendEmailWithLamba(
        to,
        subject,
        firstName,
        { firstName, amount, paymentId, courseName },
        'payment-update',
      );
      // await this.mailerService.sendMail({
      //   to,
      //   subject,
      //   template: 'payment-update',
      //   context: {
      // firstName,
      // amount,
      // paymentId,
      // courseName,
      //   },
      // });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  // async sendTicketCreatedEmail(
  //   to: string,
  //   subject: string,
  //   firstName: string,
  //   businessName: string,
  // ) {
  //   try {
  //     await this.mailerService.sendMail({
  //       to,
  //       subject,
  //       template: 'new-ticket',
  //       context: { firstName, businessName },
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.log(error);
  //     }
  //   }
  // }

  // async sendTicketUpdatedEmail(
  //   to: string,
  //   subject: string,
  //   firstName: string,
  //   status: string,
  // ) {
  //   try {
  //     await this.mailerService.sendMail({
  //       to,
  //       subject,
  //       template: 'ticket-status-update',
  //       context: { firstName, status },
  //     });
  //   } catch (error: unknown) {
  //     console.log(error);
  //   }
  // }

  private async sendEmailWithLamba(
    to: string,
    subject: string,
    name: string,
    data: any,
    emailType: string,
  ) {
    try {
      if (
        !this.AWS_LAMBDA_URL ||
        !this.AWS_REGION ||
        !this.AWS_USER_ACCESS_KEY ||
        !this.AWS_USER_SECRET_ACCESS_KEY
      ) {
        return console.log('AWS credentials are not provided');
      }

      const url = new URL(this.AWS_LAMBDA_URL);

      const credentials = {
        accessKeyId: this.AWS_USER_ACCESS_KEY,
        secretAccessKey: this.AWS_USER_SECRET_ACCESS_KEY,
      };

      const body = JSON.stringify({ ...data, to, subject, name, emailType });

      const request = new HttpRequest({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        method: 'POST',
        path: url.pathname || '/',
        headers: {
          host: url.host,
          'content-type': 'application/json',
        },
        body,
      });

      const signer = new SignatureV4({
        credentials,
        region: this.AWS_REGION,
        service: 'lambda',
        sha256: Sha256,
      });

      const signedRequest = await signer.sign(request);

      const response = await axios.post(this.AWS_LAMBDA_URL, body, {
        headers: signedRequest.headers,
      });

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }
}
