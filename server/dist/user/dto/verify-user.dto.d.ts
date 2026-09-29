export declare class VerifyUserDto {
    readonly verificationCode: string;
    readonly action: 'ACCOUNT_VERIFICATION' | 'PASSWORD_RESET';
}
