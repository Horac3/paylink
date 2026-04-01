# Payer Identity Context

Handles payer registration, Firebase OTP verification, and MSISDN encryption.

## MSISDN Security Rules

1. MSISDN encrypted (AES-256-GCM) before any persistence
2. Only last 4 digits stored as plaintext (`msisdnHint`) for display
3. bcrypt hash stored for verification
4. Decryption ONLY occurs in `ResolvePayerHandler` before STK push
5. MSISDN never appears in logs (hint only), URLs, or API responses
6. Flutter stores only `payer_session_token` + `msisdn_hint` — never the MSISDN

## Firebase OTP Flow

1. Flutter: `firebase_auth.signInWithPhoneNumber(msisdn)` — Firebase sends SMS (free)
2. Flutter: user enters OTP → Firebase verifies → returns ID token
3. Flutter: `POST /api/v1/payers/verify-otp { idToken }`
4. Backend: `firebase-admin.auth().verifyIdToken(idToken)` → extracts phone
5. Backend: compares with stored MSISDN → marks `verified: true`

## API Endpoints

All at `/api/v1/payers`:

| Method | Path           | Auth | Description                         |
|--------|----------------|------|-------------------------------------|
| POST   | /register      | No   | Register payer with email + MSISDN  |
| POST   | /verify-otp    | Yes  | Verify Firebase OTP                 |
| GET    | /profile       | Yes  | Get profile (no MSISDN in response) |
| PUT    | /preferred-rail| Yes  | Update preferred rail               |
| PATCH  | /fcm-token     | Yes  | Update FCM token                    |
