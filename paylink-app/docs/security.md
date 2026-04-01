# PayLink Flutter — Security Model

## Threat Model

PayLink handles mobile money payments for end users in Malawi. The primary threats are:

- **MSISDN leakage** — mobile numbers are PII and can be used for social engineering
- **Payment authorisation bypass** — an attacker with device access should not be able to trigger payments
- **Token theft** — auth tokens extracted from device storage
- **Network interception** — MITM attacks on the API channel
- **Compromised devices** — rooted/jailbroken devices offer attackers OS-level access

---

## 1. MSISDN Never in Flutter

The payer's phone number (MSISDN) is never stored in the Flutter app.

**Registration flow:**
- Payer enters their number → sent to Firebase for OTP verification
- Firebase `idToken` + MSISDN sent to backend `/payer-auth/verify-otp`
- Backend stores the encrypted MSISDN, issues a `payerSessionToken` (opaque UUID)
- Flutter stores only: `payerSessionToken`, `msisdnHint` (e.g. `+265 *** *** 234`)

**Payment flow:**
- API call sends `{ linkSlug, payerSessionToken }` — MSISDN is never in the request
- Backend decrypts MSISDN from the session token server-side

**Display:**
- `msisdnHint` is used only for display ("Paying from +265 *** *** 234")
- It is never sent back to the API

---

## 2. Biometric Gate

Every payment confirmation requires local biometric authentication.

```dart
// In PayerPaymentController.initiate():
final authenticated = await biometricService.authenticate(
  reason: 'Confirm payment',
);
if (!authenticated) {
  state = AsyncData(PaymentFailed('Biometric authentication cancelled'));
  return;  // ← hard stop, no API call made
}
```

Configuration:
- `biometricOnly: false` — allows device PIN/password as fallback (required for accessibility)
- `stickyAuth: true` — authentication persists if user briefly leaves the app

**There is no bypass path in the codebase.**

---

## 3. Secure Storage

`flutter_secure_storage` is used for all sensitive data.

| Platform | Mechanism |
|---|---|
| Android | `EncryptedSharedPreferences` (AES-256, requires API 23+; app targets API 26+) |
| iOS | Keychain with `KeychainAccessibility.first_unlock` |

Keys stored:
- `auth_token` — merchant JWT access token
- `refresh_token` — merchant JWT refresh token  
- `merchant_id` — merchant UUID
- `payer_session_token` — opaque payer session token
- `msisdn_hint` — masked display string (not sensitive, but stored consistently)
- `user_role` — `merchant` or `payer`
- `fcm_token` — Firebase Cloud Messaging device token

On sign-out: `SecureStorageService.clearAll()` calls `FlutterSecureStorage.deleteAll()`.

---

## 4. Certificate Pinning

Implemented in `certificate_pinner.dart` using Dio's `IOHttpClientAdapter`.

- **Debug mode** (`kDebugMode == true`): pinning is disabled to allow Charles/Proxyman interception during development
- **Release mode**: `IOHttpClientAdapter` is installed with a `badCertificateCallback` that rejects certificates for `api.paylink.never9to5ive.com`

**Activating SPKI pinning for release:**

1. Extract the leaf certificate SPKI hash:
   ```bash
   openssl s_client -connect api.paylink.never9to5ive.com:443 2>/dev/null \
     | openssl x509 -pubkey -noout \
     | openssl pkey -pubin -outform der \
     | openssl dgst -sha256 -binary \
     | base64
   ```
2. Pass it at build time:
   ```bash
   flutter build apk --dart-define=CERT_PIN_SHA256=<base64-hash>
   flutter build ipa --dart-define=CERT_PIN_SHA256=<base64-hash>
   ```

---

## 5. Root / Jailbreak Detection

`RootDetectionService.isCompromised()` runs at app startup before `ProviderContainer` is set up.

**Android checks:**
- Existence of `su` binary at 10 common paths (`/system/bin/su`, `/sbin/su`, etc.)
- Presence of `Superuser.apk`

**iOS checks:**
- Presence of Cydia (`/Applications/Cydia.app`)
- MobileSubstrate dylib
- Writable paths outside the sandbox

**Response:**
```dart
if (isCompromised) {
  runApp(MaterialApp(home: SecurityWarningScreen()));
  return;  // ← app never reaches ProviderContainer setup
}
```

`SecurityWarningScreen` is a full-screen red blocker with no dismiss button. The user must unroot their device.

---

## 6. Token Auto-Refresh (401 Handling)

`AuthInterceptor` in `api_client.dart`:

1. Attaches `Authorization: Bearer <token>` to every request
2. On 401 response:
   a. Reads `refresh_token` from secure storage
   b. POST `/auth/refresh`
   c. Saves new `access_token`
   d. Retries the original request exactly once
3. On refresh failure (network error or 401 on refresh): `deleteAll()` → user must re-login

A `_isRefreshing` flag prevents concurrent refresh races.

---

## 7. Minimum SDK

`minSdk = 26` (Android 8.0 Oreo) is enforced in `android/app/build.gradle.kts`.

This is a security requirement: `EncryptedSharedPreferences` (used by `flutter_secure_storage`) requires API 23+, and AES-256-GCM hardware-backed key storage is broadly available from API 26+. Setting 26 as the floor eliminates a class of devices where secure storage could fall back to software encryption.
