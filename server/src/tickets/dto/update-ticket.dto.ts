import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  readonly status: TicketStatus;

  @IsString()
  @IsNotEmpty()
  readonly companyName: string;
}
