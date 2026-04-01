# Settlement Context

Append-only fee ledger. Triggered by domain events, never by direct calls.

## Fee Calculation

`feeAmount = grossAmount × FeeTier.rateFor(tier)` (Decimal.js, never float)
`netAmount = grossAmount - feeAmount`

| Tier       | Rate |
|------------|------|
| STARTER    | 2.0% |
| GROWTH     | 1.5% |
| ENTERPRISE | 1.0% |

## Entries

- `CHARGE` — written on `payment.settled`
- `REFUND_REVERSAL` — written on `refund.completed` (compensating entry)

FeeEntry table is append-only — no UPDATE or DELETE ever.
