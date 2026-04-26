import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ReserveTicketDto {
  @ApiProperty({ example: 'cmevent123' })
  @IsString()
  @MinLength(1)
  eventId!: string;

  @ApiProperty({ example: 'A-12' })
  @IsString()
  @MinLength(1)
  seatLabel!: string;
}
