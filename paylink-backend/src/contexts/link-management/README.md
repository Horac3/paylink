# Link Management Context

Manages PaymentLink lifecycle: creation, QR codes, state machine, and validation for payments.

## Link Types

| Type         | Amount Required | Recurrence Required |
|--------------|-----------------|---------------------|
| INVOICE      | Yes             | No                  |
| SUBSCRIPTION | Yes             | Yes                 |
| DONATION     | No              | No                  |
| REQUEST      | No              | No                  |

## State Machine

```
ACTIVE → markPaid()        → PAID
ACTIVE → markPartiallyPaid → PARTIALLY_PAID
ACTIVE → cancel()          → CANCELLED
ACTIVE → expire()          → EXPIRED
PARTIALLY_PAID → markPaid  → PAID
PARTIALLY_PAID → cancel()  → CANCELLED
```

## Cross-Context Integration

Payment context queries `ValidateLinkQuery` via QueryBus before initiating payment.
