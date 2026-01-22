import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @IsNotEmpty()
  readonly verificationCode: string;

  @IsString()
  @IsNotEmpty()
  readonly action: 'ACCOUNT_VERIFICATION' | 'PASSWORD_RESET';
}
