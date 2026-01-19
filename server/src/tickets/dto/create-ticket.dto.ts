import { IsString, IsNotEmpty, Length, IsEnum } from 'class-validator';

enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  readonly description: string;

  @IsEnum(TicketStatus)
  readonly status: TicketStatus;
}
