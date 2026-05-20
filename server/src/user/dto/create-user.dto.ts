import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
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
  readonly password: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  readonly role: RoleEnum;
}

export class CreateGoogleUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly profilePicture: string;
}
