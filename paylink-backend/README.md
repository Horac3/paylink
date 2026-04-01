# PayLink Backend

PayLink payment orchestration API for the Malawian market.

## API Base URL

`https://api.paylink.never9to5ive.com/api/v1`

Swagger UI: `https://api.paylink.never9to5ive.com/api/docs`

## Quick Start

```bash
cp .env.example .env
# Fill in all env vars
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Environment Reference

See `.env.example` for all required environment variables.

## Architecture

- NestJS 10 + TypeScript 5 strict mode
- Prisma 5 + PostgreSQL
- CQRS via @nestjs/cqrs
- Domain events via @nestjs/event-emitter (EventEmitter2, wildcard)
- BullMQ + Redis for queues
- PawaPay as the sole payment rail (IRailAdapter pattern for extensibility)

## Adding a New Payment Rail

See `src/contexts/payment/README.md` for the 5-step guide.
