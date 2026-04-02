# Payment Context

Handles payment initiation, rail integration, and settlement via callback/polling.

## Registered Rails

| Rail ID | Provider | Settlement | MSISDN Format |
|---|---|---|---|
| `PAWAPAY` | PawaPay aggregator | Inbound webhook + polling failsafe | E.164 `265XXXXXXXXX` |
| `TNM` | TNM Mpamba | Polling only (every 30s, max 20 attempts) | E.164 `265XXXXXXXXX` |
| `AIRTEL` | Airtel Money | Polling only (every 30s, max 20 attempts) | Local `8XXXXXXXX` |

## Adding a New Rail

See [docs/adding-a-rail.md](../../docs/adding-a-rail.md) for the full 5-step guide.

## MSISDN Auto-detection

`InitiatePaymentHandler` detects the rail automatically from the MSISDN prefix:

| Prefix | Rail |
|---|---|
| 88X, 89X, 99X | TNM |
| 75X, 76X, 77X, 78X, 97X | AIRTEL |

If detection fails, the request is rejected with an error asking the payer to select their provider manually.

## Callback Flow (PawaPay)

```
POST /callback/deposit
  → CallbackController responds 200 immediately
  → Enqueues job to 'payment-callbacks' BullMQ queue
  → DepositCallbackProcessor dispatches SettlePaymentCommand or FailPaymentCommand
```

## Polling Flow (TNM / Airtel)

```
initiateDeposit → 202/pending accepted
  → Schedule BullMQ polling job (delay: 0, attempts: 20, backoff: 30s)
  → PollingProcessor.process() calls adapter.getDepositStatus()
  → COMPLETED → SettlePaymentCommand (stores receiptNumber / externalProviderRef)
  → FAILED    → FailPaymentCommand
  → PENDING   → throws → BullMQ retries after 30s
  → After 20 attempts (10 min) → BullMQ exhausts → FailPaymentCommand
```

## Refund ID Requirements

| Rail | Field needed for refund | Stored as |
|---|---|---|
| PAWAPAY | `depositId` (our UUID) | — |
| TNM | `receipt_number` from settled invoice | `transaction.receiptNumber` |
| AIRTEL | `airtel_money_id` from enquiry response | `transaction.externalProviderRef` |
