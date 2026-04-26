import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Ticket, TicketStatus } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { RedisService } from '../shared/redis.service';
import { AttendeeClient } from '../shared/attendee.client';
import { EventsService } from '../events/events.service';
import { ReserveTicketDto } from './dto/reserve-ticket.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly attendees: AttendeeClient,
    private readonly events: EventsService,
  ) {}

  async availability(eventId: string): Promise<{ remaining: number; total: number }> {
    const event = await this.events.getById(eventId);
    const taken = await this.prisma.ticket.count({
      where: { eventId, status: { not: TicketStatus.CANCELLED } },
    });
    return { remaining: Math.max(event.capacity - taken, 0), total: event.capacity };
  }

  async reserve(dto: ReserveTicketDto, attendeeId: string): Promise<Ticket> {
    // Cross-service verification - attendee must exist.
    const exists = await this.attendees.exists(attendeeId);
    if (!exists) throw new NotFoundException(`Attendee ${attendeeId} not found`);

    const event = await this.events.getById(dto.eventId);
    const lockKey = `seat:${dto.eventId}:${dto.seatLabel}`;
    const acquired = await this.redis.acquireLock(lockKey, 5000);
    if (!acquired) throw new ConflictException('Seat is being reserved by someone else');

    try {
      const taken = await this.prisma.ticket.count({
        where: { eventId: dto.eventId, status: { not: TicketStatus.CANCELLED } },
      });
      if (taken >= event.capacity) {
        throw new ConflictException('Event is sold out');
      }

      return await this.prisma.ticket.create({
        data: {
          eventId: dto.eventId,
          attendeeId,
          seatLabel: dto.seatLabel,
          status: TicketStatus.CONFIRMED,
        },
      });
    } catch (err) {
      // Prisma unique violation (P2002) means seat already booked.
      if ((err as { code?: string }).code === 'P2002') {
        throw new ConflictException(`Seat ${dto.seatLabel} already taken`);
      }
      throw err;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  listForAttendee(attendeeId: string): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: { attendeeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
