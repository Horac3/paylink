# PayLink Operations Runbook

## Environment Setup

```bash
cp .env.example .env
# Fill all values
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Health Checks

- API: `GET /api/v1/admin/wallet-balances` (requires JWT)
- Swagger: `/api/docs`
- Redis: check BullMQ queue depths

## Common Issues

### Callback not processing
1. Check BullMQ queue `payment-callbacks` in Redis
2. Verify PawaPay IP whitelist in production
3. Check `DepositCallbackProcessor` logs

### MSISDN encryption errors
- Verify `ENCRYPTION_KEY` is exactly 64 hex characters (32 bytes)
- Check `ENCRYPTION_IV_LENGTH` is 16

### Firebase OTP failing
- Verify `FIREBASE_SERVICE_ACCOUNT_PATH` points to valid JSON
- Check Firebase project ID matches

## PawaPay Callback URLs

Configure in PawaPay dashboard:
- Deposit: `https://api.paylinks.never9to5ive.com/api/v1/callback/deposit`
- Payouts: `https://api.paylinks.never9to5ive.com/api/v1/callback/payouts`
- Refund:  `https://api.paylinks.never9to5ive.com/api/v1/callback/refund`

Note: callback domain uses `paylinks` (with 's'), API domain uses `paylink` (no 's').

## Monitoring

PawaPay wallet balance: `GET /api/v1/admin/wallet-balances`
