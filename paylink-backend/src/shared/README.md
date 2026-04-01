# Shared Kernel

Pure TypeScript shared infrastructure used across all bounded contexts.

## Value Objects

- `UniqueId` — UUID v4 factory
- `MerchantId` — branded UUID for merchant identity
- `PayerId` — branded UUID for payer identity
- `Money` — Decimal.js precision money. Methods: add, subtract, multiplyByRate, equals
- `FeeTier` / `FeeTierHelper` — fee tier enum with rate lookup

## Domain Events

- `DomainEvent` — abstract base with eventId, occurredAt, eventType

## Errors

- `DomainError` → HTTP 400
- `NotFoundError` → HTTP 404
- `ConflictError` → HTTP 409
- `UnauthorisedError` → HTTP 401
- `RailUnavailableError` — retryable rail error
- `RailRejectedError` — non-retryable, carries failureCode
- `RailTimeoutError` — retryable
- `RailAuthError` — alert immediately

## Guards / Filters / Interceptors

- `JwtAuthGuard` — global JWT guard, skips @PublicRoute() routes
- `DomainExceptionFilter` — maps domain errors to HTTP responses
- `LoggingInterceptor` — structured logging, masks MSISDN to last 4 digits

## Decorators

- `@CurrentMerchant()` — extracts merchantId from JWT
- `@PublicRoute()` — marks route as public (no auth required)
