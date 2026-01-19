import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ActivityLogDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 500)
  readonly description: string;

  @IsString()
  readonly createdFor: string;

  @IsString()
  readonly createdBy?: string;
}
