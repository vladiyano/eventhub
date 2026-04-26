import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'NestJS Workshop' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'Hands-on workshop building a REST API.' })
  @IsString()
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ example: 'Tel Aviv Convention Center' })
  @IsString()
  @MaxLength(200)
  venue!: string;

  @ApiProperty({ example: '2026-06-01T18:00:00.000Z' })
  @IsDateString()
  startsAt!: string;

  @ApiProperty({ example: 100, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
