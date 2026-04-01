# PayLink Backend — Architecture

## Overview

PayLink is a payment orchestration platform. Merchants create smart payment links;
payers receive them and pay via mobile money. PayLink routes through PawaPay, takes
a fee at settlement, and forwards the net to the merchant.

## Project Structure

```
paylink-backend/
├── src/
│   ├── shared/              # Shared kernel — VOs, errors, guards, interceptors
│   ├── contexts/            # Bounded contexts (DDD)
│   │   ├── identity/        # Merchant auth
│   │   ├── payer-identity/  # Payer registration + MSISDN encryption
│   │   ├── link-management/ # PaymentLink lifecycle
│   │   ├── payment/         # Payment initiation, PawaPay adapter
│   │   ├── refund/          # Refund lifecycle
│   │   ├── settlement/      # Fee engine + append-only ledger
│   │   ├── notification/    # FCM, email, webhooks
│   │   ├── subscription/    # Recurring payment scheduler
│   │   └── analytics/       # Event sourcing + snapshot projection
│   ├── infrastructure/      # Prisma, Firebase, email, passport
│   └── admin/               # Admin endpoints
├── prisma/                  # Prisma schema + migrations
└── docs/                    # Architecture, API reference, runbooks
```

## Layer Architecture (each context)

```
domain/        ← Pure TypeScript — no NestJS imports. Aggregates, VOs, events, ports.
application/   ← Command/Query handlers, BullMQ processors. Orchestrates domain + infra.
infrastructure/← Repository implementations, external API adapters.
interface/     ← NestJS controllers + DTOs. HTTP boundary only.
```

## Cross-Context Communication

- **Synchronous reads**: `QueryBus.execute()` only
- **Side effects**: `EventEmitter2` `@OnEvent()` only
- **No direct service injection** across bounded context boundaries

## Payment Rail Architecture

PawaPay is the only rail. Adding a new rail = 5 steps, nothing else changes.
See `src/contexts/payment/README.md`.

## MSISDN Security

1. AES-256-GCM encrypted at rest
2. bcrypt hash for comparison
3. Last 4 digits hint for display
4. Decryption only in `ResolvePayerHandler`
5. Never in logs, URLs, or API responses
