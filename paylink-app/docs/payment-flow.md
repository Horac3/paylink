# PayLink — Payer Payment Flow

## Overview

The payment flow is designed so that the payer's MSISDN is never transmitted from the Flutter app. The backend already knows the MSISDN from the `payerSessionToken` it issued at OTP verification time.

---

## Step 1 — Entry (QR Scan or Deep Link)

**QR Scan path:**
1. Payer opens the app → taps Scan tab
2. `PayerQrScannerPage` activates the camera via `MobileScannerController`
3. On barcode detection, `rawValue` is parsed:
   - URL format: `https://paylink.never9to5ive.com/pay/<slug>` or `paylink://pay/<slug>`
   - Slug is extracted from the second-to-last path segment
4. App navigates to `/payer/pay/<slug>`

**Deep link path (cold start):**
1. User taps a shared link on their phone
2. OS delivers the URI to `DeepLinkService` via `AppLinks.getInitialLink()`
3. `DeepLinkService._handleUri()` extracts the slug and calls `router.push('/payer/pay/<slug>')`

**Deep link path (app already running):**
1. URI arrives on `AppLinks.uriLinkStream`
2. Same `_handleUri()` handler processes it

---

## Step 2 — Payment Confirmation Screen

`PayerPaymentConfirmPage` receives the `slug` as a constructor argument.

The screen shows:
- Payment description (derived from slug)
- Payer's masked phone number (`msisdnHint` from `SecureStorageService`)
- Amount field (for open-amount links)
- "Confirm & Pay" button — **disabled when offline** (watched via `connectivityProvider`)

---

## Step 3 — Biometric Gate

When the payer taps "Confirm & Pay":

```
HapticFeedback.mediumImpact();
PayerPaymentController.initiate(linkSlug: slug, amount: amount);
```

Inside `initiate()`:
1. State → `PaymentAwaitingBiometric`
2. `BiometricService.authenticate(reason: 'Confirm payment')` is called
3. **If authentication returns false → state = `PaymentFailed('Biometric authentication cancelled')`** — payment is blocked, no API call made
4. If authentication succeeds → continue

There is no bypass path. `biometricOnly: false` allows device PIN/password as fallback for users without biometrics enrolled.

---

## Step 4 — API Call

```dart
final token = await storage.getPayerSessionToken();
final response = await api.initiatePayment(InitiatePaymentRequestDto(
  linkSlug: slug,
  payerSessionToken: token!,
  amount: amount,  // null for fixed-amount links
));
```

**The MSISDN is never sent.** The backend resolves the payer's identity from `payerSessionToken`.

State → `PaymentProcessing`

---

## Step 5 — Status Polling

The backend processes the payment asynchronously via PawaPay. The app polls:

```dart
for (int i = 0; i < 10; i++) {
  await Future.delayed(const Duration(seconds: 3));
  final status = await api.getPaymentStatus(transactionId);
  if (status.status == 'COMPLETED') { /* → PaymentSuccess */ break; }
  if (status.status == 'FAILED')    { /* → PaymentFailed  */ break; }
}
// After 10 attempts (30s): → PaymentFailed('Payment timed out')
```

---

## Step 6 — Terminal State UI

| State | UI |
|---|---|
| `PaymentSuccess` | Green check icon, "Payment Successful!", Done button → payer home |
| `PaymentFailed` | Red X icon, failure reason, Try Again + Cancel buttons |

---

## Step 7 — Push Notification (Async Confirmation)

If the payer has background push enabled, the backend sends an FCM notification when the transaction completes. `FcmService._handleMessageOpenedApp()` routes `type=payment_request` to the payment confirm page.

---

## Merchant Refund Flow

1. Merchant navigates to a completed transaction's detail page
2. Taps "Request Refund" → `RefundRequestBottomSheet` appears
3. Enters reason (minimum 10 characters)
4. Submits → `MerchantRefundController.requestRefund()` calls `api.requestRefund()`
5. On success: sheet dismissed, SnackBar "Refund requested"
6. Backend processes refund asynchronously via PawaPay
