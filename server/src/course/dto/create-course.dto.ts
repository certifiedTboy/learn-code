import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsDecimal,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  readonly contents: {
    mainTopic: string;
    description: string;
    subTopics: [{ title: string; contentURI: string; isVideo: boolean }];
  }[];

  @IsArray()
  readonly skills: string[];

  @IsNotEmpty()
  @IsNumber()
  readonly subscribers: number;

  @IsNotEmpty()
  @IsNumber()
  readonly completed: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsDecimal()
  readonly rating: number;

  @IsNumber()
  @IsNotEmpty()
  readonly totalTopics: number;

  @IsNotEmpty()
  @IsNumber()
  readonly requiredDuration: number;

  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @IsOptional()
  @IsNumber()
  readonly percentageDiscount: number;
}
