# Getting Started

## Prerequisites

- Node.js 22+
- PostgreSQL 16 (running locally or via a cloud provider)
- Redis 7 (running locally or via a cloud provider)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See [environment-setup.md](./environment-setup.md) for how to obtain each value.

Minimum required for local dev:

```env
DATABASE_URL=postgresql://paylink:paylink@localhost:5432/paylink
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<generate>
PAYER_SESSION_SECRET=<generate>
ENCRYPTION_KEY=<generate>
```

Generate secrets:

```bash
# JWT_SECRET / PAYER_SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# ENCRYPTION_KEY (must be 32 bytes hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Run database migrations

This must be done before starting the server. The `dotenv -e .env` prefix is required because the Prisma CLI does not load `.env` automatically — it injects `DATABASE_URL` into the process so Prisma can connect.

```bash
npm run migrate:dev
```

On subsequent runs (e.g. after pulling new migrations from git), use:

```bash
npm run migrate:deploy
```

## 4. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.  
Swagger docs: `http://localhost:3000/api/v1/docs`.

---

## Command reference

| Command | What it does |
|---|---|
| `npm run start:dev` | Start server with file watching |
| `npm run start:prod` | Start compiled production build |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run migrate:dev` | Create + apply a new migration (dev only) |
| `npm run migrate:deploy` | Apply pending migrations (CI / production) |
| `npm run migrate:reset` | Drop and recreate the database, re-run all migrations |
| `npm run migrate:status` | Show which migrations have been applied |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

---

## Typical dev workflow

```
npm install
cp .env.example .env   # fill in values
npm run migrate:dev    # sets up the database schema
npm run start:dev      # start the server
```

After pulling changes that include new migrations:

```
npm run migrate:deploy
npm run start:dev
```
