import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
  IsAlpha,
  IsLowercase,
} from 'class-validator';

enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 50)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 50)
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  readonly role: RoleEnum;
}
