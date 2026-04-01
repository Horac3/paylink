# Adding a New Payment Rail

PayLink uses the `IRailAdapter` pattern. Adding TNM as an example:

## Step 1: Create the adapter

```typescript
// src/contexts/payment/infrastructure/adapters/tnm.adapter.ts
@Injectable()
export class TnmAdapter implements IRailAdapter {
  readonly railId = 'TNM';
  // Implement all 7 IRailAdapter methods
}
```

## Step 2: Implement IRailAdapter

All 7 methods are required:
- `initiateDeposit`
- `initiatePayout`
- `initiateRefund`
- `getDepositStatus`
- `getRefundStatus`
- `predictProvider`
- `checkAvailability`

## Step 3: Register in PaymentModule

```typescript
providers: [
  TnmAdapter,
  // ... existing providers
]
```

## Step 4: Register in RailRouterService

```typescript
onModuleInit(): void {
  this.registry.set('PAWAPAY', this.pawaPayAdapter);
  this.registry.set('TNM', this.tnmAdapter);  // ← add this
}
```

## Step 5: Add callback endpoint

```typescript
@Post('tnm')
async tnmCallback(@Body() body: TnmCallbackBody) {
  this.logger.log(`[CALLBACK] TNM received`);
  await this.callbackQueue.add('process-tnm-callback', body);
  return { received: true };
}
```

That's it. No domain code changes. No Flutter changes.
