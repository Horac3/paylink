# Payment Context

Handles payment initiation, PawaPay integration, and settlement via callback/polling.

## Adding a New Rail

Exactly 5 steps — nothing else changes:

1. Create `src/contexts/payment/infrastructure/adapters/tnm.adapter.ts`
2. Implement `IRailAdapter` — set `railId = 'TNM'`
3. Inject in `PaymentModule` providers
4. Register: `this.registry.set('TNM', tnmAdapter)` in `RailRouterService`
5. Add `POST /api/v1/callback/tnm` to `CallbackController`

## Callback Flow

```
PawaPay POST /callback/deposit
  → CallbackController responds HTTP 200 immediately
  → Enqueues ProcessDepositCallbackJob to BullMQ
  → DepositCallbackProcessor dispatches SettlePaymentCommand or FailPaymentCommand
```

## Polling Failsafe

If callback not received within 10 minutes:
- BullMQ delayed job fires `PollingProcessor`
- Calls `GET /v2/deposits/:depositId`
- Resolves transaction accordingly
