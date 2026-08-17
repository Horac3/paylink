# PayLink

Payment-orchestration platform for the **Malawian market**. Merchants create smart payment links (invoices, subscriptions, donations, requests); payers pay them via mobile money. PayLink routes payments through mobile-money rails, takes a fee at settlement, and forwards the net amount to the merchant — with refunds, recurring billing, notifications, and per-link analytics built in.

This is a monorepo of five standalone apps. Each package is independent (its own toolchain, deps, and README) and is worked on from its own directory.

## Repository layout

| Package | Stack | What it is |
|---|---|---|
| [`paylink-backend/`](./paylink-backend/) | NestJS 11, TypeScript (strict), Prisma 7 + PostgreSQL, CQRS, BullMQ + Redis | The API — all business logic lives here |
| [`paylink-app/`](./paylink-app/) | Flutter 3, Riverpod, go_router, Retrofit, freezed | Mobile app with a **merchant** side and a **payer** side |
| [`paylink-payment-web/`](./paylink-payment-web/) | Vite + React 19 + Tailwind | Public payment page a payer opens from a PayLink |
| [`paylink-merchant-web/`](./paylink-merchant-web/) | Vite + React 19 + Tailwind | Merchant dashboard / portal |
| [`paylink-docs/`](./paylink-docs/) | Vite + React 19 + Tailwind | Interactive API reference |

## What the platform does

1. A merchant signs up, gets a fee tier, and creates payment **links** — fixed amount (invoice / subscription) or open amount (donation / request) — rendered with a QR code.
2. The link is shared. A payer opens it (web payment page, or the mobile app), and pays with their mobile number.
3. The backend detects the mobile-money provider from the MSISDN prefix (Airtel Money / TNM Mpamba) and routes the deposit through **PawaPay** (sandbox in dev).
4. On settlement, PayLink charges a fee and records it in an append-only ledger; the payer gets a receipt (email + push + optional merchant webhook); the merchant sees the transaction in the portal/app.
5. Merchants can refund (full or partial), set up recurring subscriptions with a retry schedule, and view per-link conversion analytics.

All five building blocks — payment initiation, callbacks, refunds, settlement, notifications, subscriptions, analytics — are DDD bounded contexts that talk to each other only through the CQRS query bus and `@nestjs/event-emitter` events.

## Current state

### Backend — implemented & live

- **Merchant identity** — register / login / refresh / logout / me. JWT access (15 min) + refresh (7 days), bcrypt passwords, fee-tier default STARTER.
- **Payment links** — invoice / subscription / donation / request types, QR code generation, full lifecycle state machine (`ACTIVE → PAID | PARTIALLY_PAID | CANCELLED | EXPIRED`).
- **Payments** — initiate (`POST /api/v1/pay/:slug/initiate`), poll status, and **SSE streaming** so clients get pushed a result when the deposit settles/fails.
  - Three payer strategies: registered-payer session token, pre-issued **recipient token** (`?r=`), or anonymous guest MSISDN.
  - Callbacks: PawaPay deposits/payouts/refunds are acknowledged immediately, then processed off the `payment-callbacks` BullMQ queue.
  - Polling failsafe lives on the `payment-polling` queue (deposits that never reach a callback).
- **Rails** — `PAWAPAY` is the only rail registered in `RailRouterService` (`DEFAULT_RAIL = 'PAWAPAY'`); the provider is derived from the MSISDN prefix (`TNM_MWI` / `AIRTEL_MWI`). **TNM Mpamba and Airtel Money direct adapters already exist and are unit-tested, but are not yet wired into the router** — that is the obvious next wiring step.
- **Refunds** — full or partial, first-class state machine, compensating `REFUND_REVERSAL` fee entries; per-rail refund lookup metadata is carried on the deposit status result.
- **Settlement** — append-only fee ledger (STARTER 2.0% / GROWTH 1.5% / ENTERPRISE 1.0%), Decimal.js arithmetic, no floats.
- **Payer identity** — MSISDNs AES-256-GCM encrypted at rest + bcrypt-hashed + last-4 hint; Firebase phone-number OTP verification; never logged or returned.
- **Subscriptions** — recurring billing with a 24h → 72h → 7d retry backoff, then cancel.
- **Notifications** — async BullMQ queues for email (Nodemailer + Handlebars), push (FCM), and HMAC-signed merchant webhooks.
- **Analytics** — event-sourced `LinkEvent` rows projected into per-link `AnalyticsSnapshot` (payments started / converted / failed / refunded).
- **Admin** — PawaPay wallet-balance endpoint (health/monitoring).
- **API conventions** — global prefix `api/v1`, whitelist-only validation, global JWT guard (public routes opt out via `@PublicRoute()`), Swagger at `/api/docs`.

Database schema (Postgres, migration `20260401183854_init`): `Merchant`, `ApiKey`, `PayerAccount`, `PaymentLink`, `Transaction`, `Refund`, `FeeEntry`, `SubscriptionSchedule`, `LinkEvent`, `AnalyticsSnapshot`.

### Mobile app (`paylink-app/`) — screens in place

- **Auth** — welcome, merchant login/register, payer register + Firebase OTP.
- **Merchant** — dashboard, links list/detail/create, transactions list/detail, refunds, analytics, bulk-send.
- **Payer** — home, QR-code scanner, payment confirmation, payment history, profile.
- Built on the `presentation → application → domain → data` per-feature layering; generated code (`*.g.dart`, `*.freezed.dart`) is produced by build_runner.

### Web payment page (`paylink-payment-web/`) — functional

- Guest flow (enter MSISDN, provider auto-detected with override), recipient-token flow, donation amount input for donation links.
- Live status via SSE with polling fallback; success / failed / error screens; dev-only sandbox number picker that previews the mocked rail outcome.

### Merchant portal (`paylink-merchant-web/`) — functional

- Dashboard with metrics, links CRUD + QR, transactions list/detail (paginated, filterable), refund form, analytics, settings, auth pages.

### Docs site (`paylink-docs/`) — functional

- Static API reference (endpoints, params, errors) with copyable examples and a "try it" panel against the live API.

### Hosting / dev infra

- Root `docker-compose.yml` runs Postgres 17 (host port **5433**) and Redis 7; the backend service is commented out. Backend ships a `Dockerfile`; each web app ships a `Dockerfile` + `nginx.conf`.
- Public endpoints referenced in config: API `api.paylink.never9to5ive.com`, payment page `paylink.never9to5ive.com`.

## Tech stack

| Concern | Choice |
|---|---|
| API runtime | Node 22, NestJS 11, TypeScript strict |
| Database | PostgreSQL 17 + Prisma 7 (driver adapter, no `url` in schema — `DATABASE_URL` read at runtime) |
| Queues | BullMQ + Redis 7, `@nestjs/event-emitter` for domain events |
| Auth | Manual JWT (merchant) + Firebase phone OTP (payer) |
| Money rail | PawaPay (sandbox), `IRailAdapter` interface for new rails |
| Mobile | Flutter 3, Riverpod, go_router, Retrofit, freezed |
| Web | React 19, Vite, Tailwind |


## Getting started

Infra first (from the repo root):

```bash
docker compose up -d postgres redis
```

Then, per app, from that app's directory:

- **Backend**: `npm install` → `cp .env.example .env` → `npm run migrate:dev` → `npm run start:dev` (port 3000). See `paylink-backend/README.md`; detailed setup for every env var is in `paylink-backend/docs/environment-setup.md`.
- **App**: `flutter pub get` → `flutter pub run build_runner build --delete-conflicting-outputs` → `flutter run`. Needs the real `.env` (declared as a Flutter asset).
- **Web apps**: `npm install` → `npm run dev` (vite; payment page on 5173, merchant portal on 5174, docs on 5175).

Agent-specific conventions, commands, and gotchas live in [`AGENTS.md`](./AGENTS.md).

## Tests

- Backend unit: `npm test` (from `paylink-backend/`); backend e2e: `npm test:e2e` (needs Postgres + Redis up).
- Flutter: `flutter test`, `flutter test integration_test/`.
- Web apps: no test suites; `npm run lint` / `npm run build` per app.