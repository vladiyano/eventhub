import { PrismaClient, EventStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      {
        title: 'TypeScript Conf 2026',
        description: 'Two days of deep dives into the TypeScript ecosystem.',
        venue: 'Tel Aviv Convention Center',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        capacity: 200,
        status: EventStatus.PUBLISHED,
        createdBy: 'seed-admin',
      },
      {
        title: 'NestJS Workshop',
        description: 'Hands-on workshop building a REST API with NestJS.',
        venue: 'Online',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        capacity: 50,
        status: EventStatus.PUBLISHED,
        createdBy: 'seed-admin',
      },
      {
        title: 'Postgres Performance Meetup',
        description: 'Indexes, EXPLAIN, and the planner.',
        venue: 'Haifa Tech Hub',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        capacity: 80,
        status: EventStatus.PUBLISHED,
        createdBy: 'seed-admin',
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('event-service seed complete');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
