import { Injectable, NotFoundException } from '@nestjs/common';
import { Event, EventStatus } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  list(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { status: EventStatus.PUBLISHED },
      orderBy: { startsAt: 'asc' },
    });
  }

  async getById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  create(dto: CreateEventDto, createdBy: string): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        venue: dto.venue,
        startsAt: new Date(dto.startsAt),
        capacity: dto.capacity,
        createdBy,
      },
    });
  }
}
