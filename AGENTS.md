# AGENTS.md

Monorepo for the PayLink payment-orchestration platform (Malawi). Five standalone apps — no root workspaces; each package is independent and must be worked on from its own directory.

## Packages

| Dir | Stack | Purpose |
|---|---|---|
| `paylink-backend/` | NestJS 11, TS strict, Prisma 7, PostgreSQL, CQRS, BullMQ/Redis | API (main app) |
| `paylink-app/` | Flutter 3, Riverpod, go_router, Retrofit, freezed | Mobile app (merchant + payer) |
| `paylink-payment-web/`, `paylink-merchant-web/`, `paylink-docs/` | Vite + React 19 + Tailwind | Web payment page, merchant portal, docs |

Root `docker-compose.yml` runs only Postgres 17 and Redis 7 (backend service is commented out). Postgres host port is **5433**, Redis is 6379.

## Backend (`paylink-backend/`)

Common flow: `npm install` → `cp .env.example .env` → `npm run migrate:dev` → `npm run start:dev` (hot-reload on port 3000).

- **`.env.example` has no `DATABASE_URL`, but it is required** — Joi validation fails to boot without it. Local value: `postgresql://paylink:paylink_password@localhost:5433/paylink`, or run `docker compose up -d postgres redis` first.
- **Prisma 7 driver adapter**: `datasource db` in `prisma/schema.prisma` declares no `url`. `DATABASE_URL` is read from `process.env` at runtime in `src/infrastructure/database/prisma.service.ts` via `@prisma/adapter-pg`. Prisma CLI does NOT load `.env` itself — use the `dotenv -e .env` prefix, already baked into the `npm run migrate:*` / `npm run db:studio` scripts.
- **Stale duplicates — don't extend them**: `src/infrastructure/prisma/` is superseded by `src/infrastructure/database/`; `src/infrastructure/firebase/services/` is superseded by root-level `src/infrastructure/firebase/firebase-*.service.ts`. Only the database module and root-level firebase services are wired in `src/app.module.ts`.
- Global API prefix `api/v1`; global `ValidationPipe` with `forbidNonWhitelisted` (any unexpected body prop → 400); global `JwtAuthGuard` — opt out with `@PublicRoute()` (`src/shared/decorators/`).
- Imports use TS path aliases `@shared/*` → `src/shared/*` and `@contexts/*` → `src/contexts/*` (tsconfig.json). Use them; relative imports across those roots are off-pattern.
- `npm run lint` runs ESLint **with `--fix`** — don't rely on it as a read-only check.
- Tests: Jest config lives in package.json (`rootDir: src`, `testRegex: *.spec.ts`). Unit: `npm test`; single file (path relative to `src/`): `npm test -- shared/errors/__tests__/rail-errors.spec.ts`. e2e: `npm test:e2e` boots `AppModule`, so **Postgres + Redis must be up**.
- Adding a payment rail: implement `IRailAdapter` (`src/contexts/payment/domain/ports/rail-adapter.interface.ts`) and register it in `RailRouterService.onModuleInit` (`src/contexts/payment/infrastructure/rail-router.service.ts`). Nothing else changes; see `src/contexts/payment/README.md` + `docs/adding-a-rail.md`.
- MSISDNs are AES-256-GCM encrypted at rest + bcrypt-hashed + last-4 hint; never log or return them. `LoggingInterceptor` masks MSISDN in logs. Never expose `ENCRYPTION_KEY`.
- Contexts are DDD-sliced (`domain`/`application`/`infrastructure`/`interface` per context). Cross-context: reads via `QueryBus` only, side effects via `@OnEvent` only — no injecting services between contexts.

## Flutter app (`paylink-app/`)

- **Codegen is mandatory to compile**: freezed/retrofit/riverpod outputs (`*.g.dart`, `*.freezed.dart`) are generated and gitignored-style excluded from analyzer. Re-run `flutter pub run build_runner build --delete-conflicting-outputs` after editing annotated files (DTOs, controllers, providers).
- `.env` is declared as a Flutter asset in `pubspec.yaml`, so it must exist for `flutter run` — but it's gitignored and there is **no `.env.example`** in this app (only the real `.env`). Don't delete it; `flutter analyze`/`test` don't need it, builds do.
- Feature layout convention: `presentation/` → `application/` (services must have **zero Flutter imports**) → `domain/` (pure Dart) → `data/`. Keep new features in this shape.
- Commands: `flutter analyze`, `flutter test`, `flutter test integration_test/`.

## Web apps (`paylink-*-web/`)

Identical scripts in each: `npm run dev` (vite), `npm run build` (`tsc -b && vite build`), `npm run lint` (`eslint .`, no auto-fix), `npm run preview`. Env via their own `.env.example`. React 19, no test suites.

## Repo conventions

- No CI, no pre-commit hooks. Branching/PR flow is plain git; commits follow the `feat:` / `chore:` style already in history.
- Secrets (`.env`, `firebase-service-account.json`) are gitignored; never commit them.