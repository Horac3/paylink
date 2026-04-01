# Refund Context

First-class refund support with full state machine and PawaPay integration.

## State Machine

```
PENDING → complete()    → COMPLETED
PENDING → fail(reason)  → FAILED
PENDING → cancel()      → CANCELLED  (only before externalRef is set)
```

## Business Rules

- Only SUCCESS transactions can be refunded
- No second refund if one is PENDING or COMPLETED
- Partial refunds allowed: amount < gross
- Cancellation only before the refund is sent to the rail

## Settlement Integration

On `refund.completed`, Settlement context writes a compensating FeeEntry
with `type = REFUND_REVERSAL` and negative feeAmount.

## API

`POST /api/v1/refunds { transactionId, amount, reason }`
`GET /api/v1/refunds/:id`
`GET /api/v1/refunds`
