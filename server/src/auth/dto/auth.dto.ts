import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
