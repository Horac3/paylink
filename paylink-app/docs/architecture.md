# PayLink Flutter App — Architecture

## Overview

PayLink is a Flutter 3.19+ mobile application targeting iOS and Android. It serves two user roles:
- **Merchant** — creates payment links, views transactions and analytics, requests refunds
- **Payer** — scans QR codes or follows deep links, authenticates via Firebase OTP, confirms payments biometrically

State management: Riverpod 2 with `@riverpod` code-generation (`riverpod_generator`).  
Navigation: `go_router` 13 with `StatefulShellRoute` for role-based bottom navigation.  
HTTP: Dio 5 + Retrofit 4 (`@RestApi` generated client).  
Security storage: `flutter_secure_storage` with platform-native encryption.

---

## Architectural Principle — Feature-First Four-Layer

Each feature is organised into four layers. Dependencies flow inward only:

```
presentation  →  application  →  domain  ←  data
```

- **presentation** — Widgets, pages, controllers (Riverpod `AsyncNotifier`)
- **application** — Services that orchestrate use cases (BiometricService, FcmService, DeepLinkService)
- **domain** — Pure Dart models: `Money`, `UserRole`, `StorageKeys`, sealed state classes
- **data** — DTOs, `PaylinkApi` (Retrofit), `SecureStorageService`, Dio client

**Features never import from each other.** All shared code lives in `lib/src/core/`.

---

## Directory Structure

```
lib/
├── main.dart                      # App bootstrap, ProviderContainer init, security gate
└── src/
    ├── core/
    │   ├── application/
    │   │   ├── biometric_service.dart
    │   │   ├── deep_link_service.dart
    │   │   └── fcm_service.dart
    │   ├── data/
    │   │   ├── api/
    │   │   │   ├── api_client.dart        # Dio factory + AuthInterceptor
    │   │   │   └── paylink_api.dart       # Retrofit @RestApi — all endpoints
    │   │   ├── dto/
    │   │   │   ├── auth_dto.dart
    │   │   │   ├── link_dto.dart
    │   │   │   ├── transaction_dto.dart
    │   │   │   ├── analytics_dto.dart
    │   │   │   └── subscription_dto.dart
    │   │   ├── providers/
    │   │   │   └── core_providers.dart    # All global providers
    │   │   └── storage/
    │   │       └── secure_storage_service.dart
    │   ├── domain/
    │   │   ├── money.dart
    │   │   ├── storage_keys.dart
    │   │   └── user_role.dart
    │   ├── presentation/
    │   │   ├── navigation/
    │   │   │   ├── router.dart            # GoRouter + StatefulShellRoute
    │   │   │   └── routes.dart            # Route path constants
    │   │   ├── theme/
    │   │   │   ├── app_colors.dart
    │   │   │   ├── app_text_styles.dart
    │   │   │   └── app_theme.dart
    │   │   └── widgets/
    │   │       ├── connectivity_banner.dart
    │   │       ├── empty_state_widget.dart
    │   │       ├── error_banner.dart
    │   │       ├── loading_button.dart
    │   │       ├── money_text.dart
    │   │       ├── paginated_list_view.dart
    │   │       ├── shimmer_loading.dart
    │   │       └── status_badge.dart
    │   └── security/
    │       ├── certificate_pinner.dart
    │       ├── root_detection_service.dart
    │       └── security_warning_screen.dart
    └── features/
        ├── auth/
        │   ├── application/
        │   │   ├── merchant_auth_controller.dart
        │   │   └── payer_auth_controller.dart
        │   └── presentation/pages/
        │       ├── welcome_page.dart
        │       ├── merchant_login_page.dart
        │       ├── merchant_register_page.dart
        │       ├── payer_register_page.dart
        │       └── payer_otp_page.dart
        ├── merchant/
        │   ├── application/
        │   │   ├── merchant_analytics_controller.dart
        │   │   ├── merchant_links_controller.dart
        │   │   ├── merchant_refund_controller.dart
        │   │   └── merchant_transactions_controller.dart
        │   └── presentation/pages/
        │       ├── merchant_dashboard_page.dart
        │       ├── merchant_links_page.dart
        │       ├── merchant_link_detail_page.dart
        │       ├── merchant_create_link_page.dart
        │       ├── merchant_bulk_send_page.dart
        │       ├── merchant_transactions_page.dart
        │       ├── merchant_transaction_detail_page.dart
        │       └── merchant_analytics_page.dart
        └── payer/
            ├── application/
            │   ├── payer_history_controller.dart
            │   └── payer_payment_controller.dart
            └── presentation/pages/
                ├── payer_home_page.dart
                ├── payer_qr_scanner_page.dart
                ├── payer_payment_confirm_page.dart
                ├── payer_history_page.dart
                └── payer_profile_page.dart
```

---

## State Management — Riverpod 2

All controllers use `@riverpod` code-generation (`riverpod_generator`). Generated files have `.g.dart` suffix.

### Controller pattern

```dart
@riverpod
class MerchantLinksController extends _$MerchantLinksController {
  @override
  Future<List<PaymentLinkDto>> build() => _fetch(page: 1);

  Future<void> loadMore() async { /* appends to state */ }
  Future<void> createLink(CreateLinkRequestDto dto) async { /* prepends */ }
}
```

### Payment sealed state

The payer payment flow uses a sealed class hierarchy instead of `AsyncValue` errors to represent terminal states explicitly:

```dart
sealed class PaymentFlowState { const PaymentFlowState(); }
class PaymentIdle extends PaymentFlowState { const PaymentIdle(); }
class PaymentAwaitingBiometric extends PaymentFlowState { const PaymentAwaitingBiometric(); }
class PaymentProcessing extends PaymentFlowState { const PaymentProcessing(); }
class PaymentSuccess extends PaymentFlowState {
  final String transactionId;
  const PaymentSuccess(this.transactionId);
}
class PaymentFailed extends PaymentFlowState {
  final String reason;
  const PaymentFailed(this.reason);
}
```

---

## Navigation

`router.dart` creates a `GoRouter` with:

- **Auth redirect guard** — checks `SecureStorageService.isAuthenticated()` on every navigation; unauthenticated users are redirected to `/` (WelcomePage)
- **Merchant shell** — `StatefulShellRoute.indexedStack` with 4 tabs: Dashboard, Links, Transactions, Analytics
- **Payer shell** — `StatefulShellRoute.indexedStack` with 4 tabs: Home, Scan, History, Profile
- **Deep-link route** — `/payer/pay/:slug` lives outside the shell so it can be reached cold from a deep link

### Route constants (`routes.dart`)

All path strings are defined as `static const` on `Routes` class to prevent typos.

---

## API Client

`createDio()` in `api_client.dart` builds a `Dio` instance with:
1. `BaseOptions` — `baseUrl` from `.env`, 30s timeouts
2. `AuthInterceptor` — injects `Authorization: Bearer <token>` from secure storage; handles 401 by refreshing and retrying once
3. `LogInterceptor` — debug logging of requests/responses
4. `applyCertificatePinning(dio)` — no-op in debug; installs `IOHttpClientAdapter` with `badCertificateCallback` in release

`PaylinkApi` is a Retrofit `@RestApi` class generated by `build_runner`. It covers all backend endpoints across auth, links, transactions, payments, refunds, analytics, and subscriptions.
