# PayLink Mobile App

Flutter mobile app for the PayLink payment orchestration platform (Malawi).

## Roles

- **Merchant** — creates payment links, views transactions, analytics, manages refunds
- **Payer** — scans QR codes, pays via mobile money with biometric confirmation

## Setup

### Prerequisites

- Flutter 3.19+ stable
- Android SDK (minSdk 26)
- Xcode 15+ (iOS 14+ target)
- Firebase project with Phone Auth + FCM enabled

### Steps

```bash
# 1. Install dependencies
flutter pub get

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Add Firebase config
# Android: android/app/google-services.json
# iOS: ios/Runner/GoogleService-Info.plist

# 4. Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# 5. Run
flutter run
```

## Deep Link Testing

```bash
# Android
adb shell am start -a android.intent.action.VIEW \
  -d "paylink://pay/test-slug" com.never9to5ive.paylink

# iOS Simulator  
xcrun simctl openurl booted "paylink://pay/test-slug"
```

## Architecture

Feature-first with four internal layers per feature:
- `presentation/` — screens, widgets, Riverpod AsyncNotifier controllers
- `application/` — services (use-case logic, zero Flutter imports)
- `domain/` — pure Dart models, enums, repository interfaces
- `data/` — repository implementations, Retrofit sources, DTOs

See `docs/architecture.md` for the full diagram.

## Build Commands

```bash
flutter test                    # Unit + widget tests
flutter test integration_test/  # Integration tests
flutter analyze                 # Static analysis
flutter build apk --release     # Android release
flutter build ios --release     # iOS release
```
