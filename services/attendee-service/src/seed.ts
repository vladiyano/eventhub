import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AttendeesService } from './attendees/attendees.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const attendees = app.get(AttendeesService);

  const sample = [
    { email: 'alice@example.com', password: 'password123', fullName: 'Alice Cooper' },
    { email: 'bob@example.com', password: 'password123', fullName: 'Bob Marley' },
  ];

  for (const a of sample) {
    try {
      await attendees.register(a);
      Logger.log(`seeded ${a.email}`, 'Seed');
    } catch (err) {
      Logger.warn(`skipped ${a.email}: ${(err as Error).message}`, 'Seed');
    }
  }

  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
