import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class FlutterwavePaymentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  readonly courseId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  readonly userId!: string;

  @IsNotEmpty()
  @IsNumber()
  readonly transactionId!: number;
}
