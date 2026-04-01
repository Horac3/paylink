# Subscription Context

Manages recurring payment scheduling, retry backoff, and cycle tracking.

## Retry Policy

| Attempt | Delay |
|---------|-------|
| 1       | 24 hours |
| 2       | 72 hours |
| 3       | 7 days |
| 4       | Cancel subscription |

## State Machine

ACTIVE → onPaymentSuccess → ACTIVE (next cycle) or COMPLETED (maxCycles reached)
ACTIVE → onPaymentFailed  → ACTIVE (retry scheduled) or CANCELLED (max retries exceeded)
