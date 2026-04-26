import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TicketsService } from './tickets.service';
import { ReserveTicketDto } from './dto/reserve-ticket.dto';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';
import { JwtPayload } from '../shared/jwt.strategy';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get('availability/:eventId')
  availability(@Param('eventId') eventId: string) {
    return this.tickets.availability(eventId);
  }

  @Post('reserve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  reserve(@Body() dto: ReserveTicketDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.tickets.reserve(dto, user.sub);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mine(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.tickets.listForAttendee(user.sub);
  }
}
