# EventHub

A small but realistic **Events & Ticketing** platform built as a TypeScript / NestJS
microservices monorepo with a Next.js storefront.

The project is intentionally sized to exercise the GrowAppAI **Stage 01** code
analyzer end-to-end (microservices, multiple databases, REST + auth + DTOs,
inter-service HTTP, Redis locks, frontend) while staying small enough to run
locally in under a minute.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│  Next.js Frontend (port 3100)                │
└──────────────────────────────────────────────┘
                │ HTTP
   ┌────────────┴────────────┐
   ▼                         ▼
┌────────────────┐    ┌──────────────────┐
│ event-service  │    │ attendee-service │
│   port 4101    │    │   port 4102      │
│ Postgres+Prisma│    │ MongoDB+Mongoose │
│ + Redis (lock) │    │                  │
└──────┬─────────┘    └──────────────────┘
       │ HTTP "verify attendee"
       └──────────►
```

| Service | Port | DB | Owns |
|---|---|---|---|
| `event-service` | 4101 | Postgres + Redis | Events, Tickets |
| `attendee-service` | 4102 | MongoDB | Attendees, RSVPs, Auth |
| `frontend` | 3100 | – | Web UI |

> Ports 4101 / 4102 / 5440 / 27018 / 6390 are intentionally outside the GrowAppAI
> platform's port range so EventHub can run side-by-side with the platform.

Bounded contexts are strict: each service owns its own database; cross-service
references (e.g. `Ticket.attendeeId`) go through HTTP, never a shared schema.

---

## Endpoints

### attendee-service (`http://localhost:4102`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | public | Create account, returns JWT |
| POST | `/auth/login` | public | Returns JWT |
| GET | `/attendees/me` | JWT | Current user profile |
| GET | `/attendees/:id/exists` | service-key | Internal lookup used by event-service |
| GET | `/rsvps` | JWT | List my RSVPs |
| POST | `/rsvps` | JWT | RSVP to an event |

### event-service (`http://localhost:4101`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/events` | public | Browse events |
| GET | `/events/:id` | public | Event details |
| POST | `/events` | JWT | Create event (any logged-in user, demo) |
| GET | `/tickets/availability/:eventId` | public | Remaining seats |
| POST | `/tickets/reserve` | JWT | Reserve a seat (Redis lock + attendee verify) |
| GET | `/tickets/my` | JWT | My tickets |

Swagger UI is mounted at `/docs` for each service.

---

## Quick start

```bash
# 1. Start databases
npm run infra:up

# 2. Install deps (workspaces share node_modules)
npm install

# 3. Run Prisma migration + seed sample data
npm run prisma:migrate
npm run seed

# 4. Start all services + frontend
npm run dev
```

Then open <http://localhost:3100>.

---

## Tech stack

- Node 20+, TypeScript 5
- NestJS 10 (REST, DI, modules, guards)
- Prisma 5 (Postgres) / Mongoose 8 (MongoDB)
- ioredis (Redis distributed lock)
- passport-jwt + class-validator + @nestjs/swagger
- Next.js 14 (App Router)
- Jest for unit tests
- Docker Compose for Postgres + MongoDB + Redis
