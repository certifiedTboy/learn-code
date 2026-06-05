import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserProfileDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  readonly lastName: string;
}
