# Environment Setup

This guide explains how to obtain every value in `.env`. Copy `.env.example` to `.env` and fill in each section.

```bash
cp .env.example .env
```

---

## Database

```env
DATABASE_URL=postgresql://user:password@localhost:5432/paylink
```

Standard PostgreSQL connection string. For local dev, create the database first:

```bash
createdb paylink
```

For production, use a managed instance (e.g. Supabase, Railway, Neon) and paste the connection string they provide.

---

## Redis

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

Used by BullMQ for job queues. Run locally with Docker:

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

For production, use a managed Redis instance (e.g. Upstash, Redis Cloud).

---

## JWT / Session Secrets

```env
JWT_SECRET=
PAYER_SESSION_SECRET=
```

Generate both with Node.js — each should be at least 32 bytes of entropy:

```bash
node -e "const c = require('crypto'); console.log(c.randomBytes(48).toString('base64'))"
```

Run this twice — use one value for `JWT_SECRET` and another for `PAYER_SESSION_SECRET`. Never reuse the same value for both.

```env
JWT_EXPIRY=15m          # Access token lifetime
JWT_REFRESH_EXPIRY=7d   # Refresh token lifetime
PAYER_SESSION_EXPIRY=30d
```

These can stay as-is unless you need different expiry windows.

---

## MSISDN Encryption

```env
ENCRYPTION_KEY=         # 64 hex characters = 32 bytes
ENCRYPTION_IV_LENGTH=16
```

AES-256-GCM key for encrypting payer phone numbers at rest. Generate:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The output is exactly 64 hex characters. `ENCRYPTION_IV_LENGTH=16` is fixed — do not change it.

> **Warning:** If you rotate this key, existing payer records become unreadable. Store it in a secrets manager (e.g. AWS Secrets Manager, HashiCorp Vault) in production.

---

## PawaPay

```env
PAWAPAY_API_TOKEN=
PAWAPAY_BASE_URL=https://api.sandbox.pawapay.io
PAWAPAY_CALLBACK_DEPOSIT=https://your-domain.com/api/v1/callback/deposit
PAWAPAY_CALLBACK_PAYOUTS=https://your-domain.com/api/v1/callback/payouts
PAWAPAY_CALLBACK_REFUND=https://your-domain.com/api/v1/callback/refund
PAWAPAY_AIRTEL_MALAWI_PROVIDER=AIRTEL_MALAWI
PAWAPAY_TNM_MALAWI_PROVIDER=TNM_MPAMBA
```

**`PAWAPAY_API_TOKEN`**
1. Log in to the [PawaPay Merchant Portal](https://dashboard.sandbox.pawapay.io) (sandbox) or production portal
2. Go to **Developer** → **API Tokens** → **Generate Token**
3. Copy the JWT shown — it is only displayed once

**`PAWAPAY_BASE_URL`**
- Sandbox: `https://api.sandbox.pawapay.io`
- Production: `https://api.pawapay.io`

**Callback URLs** — must be publicly reachable HTTPS endpoints. During local development use [ngrok](https://ngrok.com):

```bash
ngrok http 3000
# Use the https URL it gives you, e.g.:
# PAWAPAY_CALLBACK_DEPOSIT=https://abc123.ngrok.io/api/v1/callback/deposit
```

**Provider IDs** — `AIRTEL_MALAWI` and `TNM_MPAMBA` are fixed identifiers used by PawaPay for Malawi. Do not change them unless PawaPay updates their provider list.

---

## Firebase

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_PROJECT_ID=your-project-id
```

**Step 1 — Create a Firebase project** (skip if you already have one)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `paylink-prod`)
3. Enable **Authentication** → **Sign-in method** → enable **Phone**

**Step 2 — Download the service account key**
1. In your Firebase project: gear icon → **Project settings** → **Service accounts** tab
2. Click **"Generate new private key"** → confirm → a JSON file downloads
3. Rename it to `firebase-service-account.json`
4. Place it in the `paylink-backend/` root (same directory as `.env`)

**Step 3 — Get the Project ID**
1. Firebase Console → **Project settings** → **General** tab
2. Copy the **Project ID** (e.g. `paylink-prod-a1b2c`)
3. Also visible as `"project_id"` inside the downloaded JSON

**Security:** add the file to `.gitignore` immediately:

```bash
echo "firebase-service-account.json" >> .gitignore
```

In production, store the JSON contents in a secret manager and load it at runtime rather than shipping it as a file.

---

## Email (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=paylink.notifications@gmail.com
SMTP_PASSWORD=
EMAIL_FROM=PayLink <paylink.notifications@gmail.com>
```

PayLink uses a Gmail account as the SMTP sender. Gmail requires an **App Password** — it does not accept your regular account password over SMTP.

**Generating a Gmail App Password**
1. Sign in to the sending Gmail account
2. Go to [myaccount.google.com](https://myaccount.google.com) → **Security**
3. Enable **2-Step Verification** (required — App Passwords are hidden until this is on)
4. Search for **"App passwords"** or go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. App: **Mail** → Device: **Other** → type `PayLink Backend` → **Generate**
6. Copy the 16-character code (shown only once, spaces are cosmetic)
7. Paste into `.env` without spaces: `SMTP_PASSWORD=abcdefghijklmnop`

**Google Workspace accounts:** an admin may need to enable SMTP relay in the Admin Console under **Apps → Google Workspace → Gmail → Advanced settings → SMTP relay service**.

**Switching providers:** swap the four `SMTP_*` vars for any provider (Resend, Mailgun, SendGrid, Postmark). No code changes needed.

---

## App

```env
APP_URL=https://api.paylink.never9to5ive.com
WEB_URL=https://paylink.never9to5ive.com
APP_PORT=3000
NODE_ENV=development
```

- `APP_URL` — the public base URL of this backend API (used in email links, callback URL validation)
- `WEB_URL` — the public URL of the web front-end (used in CORS and email links)
- `APP_PORT` — local port; default `3000`
- `NODE_ENV` — `development` | `production` | `test`

For local development these can stay as placeholder values. Update them when deploying.
