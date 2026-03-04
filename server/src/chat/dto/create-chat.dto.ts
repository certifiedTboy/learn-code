import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  readonly message: string;

  @IsString()
  @IsNotEmpty()
  readonly senderId: string;

  @IsString()
  @IsNotEmpty()
  readonly roomId: string;
}
