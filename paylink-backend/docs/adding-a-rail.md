# Adding a New Payment Rail

PayLink uses the `IRailAdapter` pattern. Every payment rail implements the same interface and registers in `RailRouterService`. No domain code changes are required.

## The 5-Step Process

### Step 1: Create the adapter

```typescript
// src/contexts/payment/infrastructure/adapters/my-rail.adapter.ts
@Injectable()
export class MyRailAdapter implements IRailAdapter {
  readonly railId = 'MY_RAIL';
  // Implement all 7 IRailAdapter methods
}
```

### Step 2: Implement `IRailAdapter`

All 7 methods are required:

| Method | Purpose |
|---|---|
| `initiateDeposit` | Start a payment (USSD push / STK push) |
| `initiatePayout` | Disburse funds to a customer |
| `initiateRefund` | Refund a settled deposit |
| `getDepositStatus` | Poll for deposit outcome → `RailDepositStatusResult` |
| `getRefundStatus` | Poll for refund outcome |
| `predictProvider` | Validate/detect provider from MSISDN |
| `checkAvailability` | Health check for the rail |

`getDepositStatus` now returns `RailDepositStatusResult` (not a plain string):

```typescript
export interface RailDepositStatusResult {
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  receiptNumber?: string;       // Rail-specific ID needed for refunds (e.g. TNM)
  externalProviderRef?: string; // Rail-specific ID needed for refunds (e.g. Airtel)
}
```

### Step 3: Register in `PaymentModule`

```typescript
providers: [
  MyRailAdapter,
  // ... existing providers
]
```

### Step 4: Register in `RailRouterService`

Inject and register in `onModuleInit`:

```typescript
constructor(
  private readonly pawaPayAdapter: PawaPayAdapter,
  private readonly myRailAdapter: MyRailAdapter,
) {}

onModuleInit(): void {
  this.registry.set('PAWAPAY', this.pawaPayAdapter);
  this.registry.set('MY_RAIL', this.myRailAdapter);
}
```

### Step 5: Add MSISDN prefix detection

In `initiate-payment.handler.ts`, add the new rail's MSISDN prefixes to `detectRailFromMsisdn()`:

```typescript
function detectRailFromMsisdn(msisdn: string): 'TNM' | 'AIRTEL' | 'MY_RAIL' | null {
  const local = msisdn.replace(/^(\+265|265)/, '');
  // ...existing checks...
  if (local.startsWith('XX')) return 'MY_RAIL';
  return null;
}
```

If the rail uses **polling only** (no inbound callbacks), add it to `POLLING_RAILS`:

```typescript
// In initiate-payment.handler.ts and polling.processor.ts
const POLLING_RAILS = new Set(['TNM', 'AIRTEL', 'MY_RAIL']);
```

---

## Callback vs. Polling Rails

| Rail | Settlement mechanism | Polling interval |
|---|---|---|
| PAWAPAY | Inbound webhook + 10-min polling failsafe | Once after 10 min |
| TNM | Polling only (no webhook) | Every 30s, max 20 attempts |
| AIRTEL | Polling only (no webhook) | Every 30s, max 20 attempts |

---

## Worked Example: TNM Mpamba (added 2026-04-02)

**Auth:** Wallet + password → short-lived token (refreshed 60s before expiry).

**Deposit:** `POST /invoices` → 202 Accepted → poll `GET /invoices/:invoice_number`.

**Key behaviours:**
- Amount is a **number** (not string like PawaPay)
- MSISDN in E.164 with `265` prefix: `265XXXXXXXXX`
- `invoice_number` = our `transaction.id` (idempotency key)
- `receipt_number` from settled invoice stored as `transaction.receiptNumber` — required for refunds
- Refund: `POST /invoices/refund/:receipt_number`

**Env vars:** `TNM_BASE_URL`, `TNM_WALLET`, `TNM_PASSWORD`

---

## Worked Example: Airtel Money (added 2026-04-02)

**Auth:** OAuth2 client credentials → 180s token (refreshed 30s before expiry).

**Deposit:** `POST /merchant/v1/payments/` → check `status.response_code` (not HTTP status).

**Key behaviours:**
- MSISDN in local format WITHOUT `265` prefix: `8XXXXXXXX`
- `DP00800001006` = in-process → poll `GET /standard/v1/payments/:id`
- `airtel_money_id` from enquiry stored as `transaction.externalProviderRef` — required for refunds
- Refund: `POST /standard/v1/payments/refund` with `airtel_money_id`
- Disbursements require RSA signing headers (`x-signature`, `x-key`) via `AirtelSigningService`
- `status.success: false` in responses is a misleading field — check `data.transaction.status` instead

**Env vars:** `AIRTEL_BASE_URL`, `AIRTEL_CLIENT_ID`, `AIRTEL_CLIENT_SECRET`, `AIRTEL_COUNTRY`, `AIRTEL_CURRENCY`, `AIRTEL_DISBURSE_PIN`, `AIRTEL_DISBURSE_PUBLIC_KEY`
