# Firebase Setup Guide

PayLink uses Firebase for two features:
- **Firebase Phone Auth** — OTP verification for payer registration
- **Firebase Cloud Messaging (FCM)** — push notifications for payment status

Both services are available on the **Spark (free) plan** for development. Production deployments with high OTP volume may require the Blaze plan.

---

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it `paylink-prod` (or `paylink-dev` for staging)
3. Disable Google Analytics (optional for this use case)

---

## 2. Enable Required Services

### Phone Authentication
1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Phone** provider
3. (Optional) Add test phone numbers for CI/CD: e.g. `+26500000001` with code `123456`

### Cloud Messaging
FCM is enabled by default. No additional setup required.

---

## 3. Android Configuration

1. In Firebase Console → **Project settings** → **Your apps** → **Add app** → Android
2. Package name: `com.never9to5ive.paylink` (match `applicationId` in `build.gradle.kts`)
3. Download `google-services.json`
4. Place it at: `android/app/google-services.json`
5. Ensure `build.gradle.kts` (project level) has:
   ```kotlin
   plugins {
     id("com.google.gms.google-services") version "4.4.0" apply false
   }
   ```
6. Ensure `android/app/build.gradle.kts` has:
   ```kotlin
   plugins {
     id("com.google.gms.google-services")
   }
   ```

---

## 4. iOS Configuration

1. In Firebase Console → **Project settings** → **Your apps** → **Add app** → iOS
2. Bundle ID: `com.never9to5ive.paylink` (match `PRODUCT_BUNDLE_IDENTIFIER` in Xcode)
3. Download `GoogleService-Info.plist`
4. In Xcode: drag `GoogleService-Info.plist` into `Runner/` (check "Copy items if needed")
5. Ensure `ios/Podfile` has:
   ```ruby
   pod 'FirebaseCore'
   pod 'FirebaseAuth'
   pod 'FirebaseMessaging'
   ```
   Or rely on Flutter's automatic pod resolution from `pubspec.yaml`.

---

## 5. Flutter Dependencies

Already in `pubspec.yaml`:
```yaml
dependencies:
  firebase_core: ^3.x.x
  firebase_auth: ^5.x.x
  firebase_messaging: ^15.x.x
```

Run:
```bash
flutter pub get
cd ios && pod install
```

---

## 6. FCM Notification Payload Format

The PayLink backend sends structured FCM data messages. The Flutter app (`FcmService`) routes them based on `data.type`:

### Payment completed (for merchant)
```json
{
  "to": "<merchant-fcm-token>",
  "data": {
    "type": "payment",
    "transactionId": "txn_abc123",
    "amount": "5000.00",
    "currency": "MWK"
  }
}
```
→ App navigates to `/merchant/transactions/txn_abc123`

### Payment request (for payer)
```json
{
  "to": "<payer-fcm-token>",
  "data": {
    "type": "payment_request",
    "slug": "my-shop-link",
    "amount": "1500.00"
  }
}
```
→ App navigates to `/payer/pay/my-shop-link`

---

## 7. Testing OTP in CI/CD

Firebase allows test phone numbers with pre-set OTP codes. Add them in:
**Firebase Console → Authentication → Sign-in method → Phone → Phone numbers for testing**

Example:
| Phone Number | Test Code |
|---|---|
| `+26500000001` | `123456` |
| `+26500000002` | `654321` |

Use these numbers in integration tests to avoid consuming real OTP quota.

---

## 8. APNs Configuration (iOS Push — Production)

For iOS push notifications in production:
1. Generate an **APNs Authentication Key** (`.p8`) in Apple Developer Console
2. Upload it in Firebase Console → **Project settings** → **Cloud Messaging** → **Apple app configuration**
3. Enter your Team ID and Key ID

Without APNs configuration, FCM push notifications will not be delivered on iOS in production.
