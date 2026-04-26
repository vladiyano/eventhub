import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '../shared/prisma.service';

describe('EventsService', () => {
  let service: EventsService;
  const prismaMock = {
    event: {
      findMany: jest.fn().mockResolvedValue([{ id: 'e1' }]),
      findUnique: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 'new' }),
    },
  };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = mod.get(EventsService);
  });

  it('list() returns published events', async () => {
    await expect(service.list()).resolves.toEqual([{ id: 'e1' }]);
  });

  it('getById() throws when missing', async () => {
    prismaMock.event.findUnique.mockResolvedValueOnce(null);
    await expect(service.getById('missing')).rejects.toThrow(NotFoundException);
  });
});
