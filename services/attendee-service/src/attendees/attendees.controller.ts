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
import { AttendeesService } from './attendees.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt.strategy';

class RsvpDto {
  eventId!: string;
}

@ApiTags('attendees')
@Controller()
export class AttendeesController {
  constructor(private readonly attendees: AttendeesService) {}

  @Get('attendees/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@Req() req: Request) {
    const user = req.user as JwtPayload;
    const a = await this.attendees.getById(user.sub);
    return {
      id: a._id.toString(),
      email: a.email,
      fullName: a.fullName,
      rsvpEventIds: a.rsvpEventIds,
    };
  }

  @Get('attendees/:id/exists')
  async exists(@Param('id') id: string) {
    return { exists: await this.attendees.exists(id) };
  }

  @Get('rsvps')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  list(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.attendees.listRsvps(user.sub);
  }

  @Post('rsvps')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: RsvpDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    const updated = await this.attendees.addRsvp(user.sub, dto.eventId);
    return { rsvpEventIds: updated.rsvpEventIds };
  }
}
