import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    AWS_LAMBDA_URL: string;
    AWS_REGION: string;
    AWS_USER_ACCESS_KEY: string;
    AWS_USER_SECRET_ACCESS_KEY: string;
    constructor(configService: ConfigService);
    sendVerificationMail(to: string, subject: string, verificationCode: string, firstName: string): Promise<void>;
    sendPasswordResetMail(to: string, subject: string, passwordResetCode: string, firstName: string): Promise<void>;
    sendPasswordChangeSuccessMail(to: string, subject: string, firstName: string): Promise<void>;
    sendAccountSetupSuccessMail(to: string, subject: string, firstName: string): Promise<void>;
    paymentSuccessMail(to: string, subject: string, firstName: string, amount: string, paymentId: string, courseName: string): Promise<void>;
    paymentUpdateSuccessMail(to: string, subject: string, firstName: string, amount: string, paymentId: string, courseName: string): Promise<void>;
    private sendEmailWithLamba;
}
