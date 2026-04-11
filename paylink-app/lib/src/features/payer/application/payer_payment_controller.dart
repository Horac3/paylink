import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/transaction_dto.dart';
import '../../../core/data/providers/core_providers.dart';
import '../../../core/domain/msisdn_utils.dart';

part 'payer_payment_controller.g.dart';

// ── Sealed payment state ───────────────────────────────────────────────────────
sealed class PaymentFlowState {
  const PaymentFlowState();
}

class PaymentIdle extends PaymentFlowState {
  const PaymentIdle();
}

class PaymentAwaitingBiometric extends PaymentFlowState {
  const PaymentAwaitingBiometric();
}

class PaymentProcessing extends PaymentFlowState {
  const PaymentProcessing();
}

class PaymentSuccess extends PaymentFlowState {
  final String transactionId;
  const PaymentSuccess(this.transactionId);
}

class PaymentFailed extends PaymentFlowState {
  final String reason;
  const PaymentFailed(this.reason);
}

// ── Controller ─────────────────────────────────────────────────────────────────
@riverpod
class PayerPaymentController extends _$PayerPaymentController {
  @override
  Future<PaymentFlowState> build() async => const PaymentIdle();

  /// Strategy A — registered payer session (default for QR scan flow).
  Future<void> initiateWithSession({required String linkSlug}) async {
    _setBiometric();

    final biometric = ref.read(biometricServiceProvider);
    if (!await biometric.authenticate(reason: 'Confirm payment')) {
      state = const AsyncData(PaymentFailed('Biometric authentication cancelled'));
      return;
    }

    _setProcessing();

    final storage = ref.read(secureStorageProvider);
    final token = await storage.getPayerSessionToken();
    if (token == null) {
      state = const AsyncData(PaymentFailed('Session expired. Please sign in again.'));
      return;
    }

    await _initiate(
      linkSlug,
      InitiatePaymentRequestDto(payerSessionToken: token),
    );
  }

  /// Strategy B — pre-filled recipient token (from ?r= deep-link param).
  Future<void> initiateWithRecipientToken({
    required String linkSlug,
    required String recipientToken,
  }) async {
    _setBiometric();

    final biometric = ref.read(biometricServiceProvider);
    if (!await biometric.authenticate(reason: 'Confirm payment')) {
      state = const AsyncData(PaymentFailed('Biometric authentication cancelled'));
      return;
    }

    _setProcessing();

    await _initiate(
      linkSlug,
      InitiatePaymentRequestDto(recipientToken: recipientToken),
    );
  }

  /// Strategy C — guest MSISDN (no payer account required).
  Future<void> initiateAsGuest({
    required String linkSlug,
    required String msisdn,
  }) async {
    _setBiometric();

    final biometric = ref.read(biometricServiceProvider);
    if (!await biometric.authenticate(reason: 'Confirm payment')) {
      state = const AsyncData(PaymentFailed('Biometric authentication cancelled'));
      return;
    }

    _setProcessing();

    final provider = detectProvider(msisdn);
    final code = providerCode(provider);

    await _initiate(
      linkSlug,
      InitiatePaymentRequestDto(
        msisdn: msisdn,
        providerCode: code,
      ),
    );
  }

  void reset() => state = const AsyncData(PaymentIdle());

  // ── Private helpers ──────────────────────────────────────────────────────────

  void _setBiometric() =>
      state = const AsyncData(PaymentAwaitingBiometric());

  void _setProcessing() =>
      state = const AsyncData(PaymentProcessing());

  Future<void> _initiate(
    String slug,
    InitiatePaymentRequestDto body,
  ) async {
    try {
      final api = ref.read(paylinkApiProvider);
      final response = await api.initiatePayment(slug, body);
      final txnId = response.transactionId;

      // Poll up to 60 times (3s interval = 3 min window)
      for (var attempt = 0; attempt < 60; attempt++) {
        await Future<void>.delayed(const Duration(seconds: 3));
        final status = await api.getPaymentStatus(txnId);

        if (status.status == 'SUCCESS') {
          state = AsyncData(PaymentSuccess(txnId));
          return;
        } else if (status.status == 'FAILED') {
          state = const AsyncData(PaymentFailed('Payment failed'));
          return;
        }
        // PENDING — keep polling
      }

      state = const AsyncData(PaymentFailed('Payment timed out'));
    } catch (e) {
      state = AsyncData(PaymentFailed(e.toString()));
    }
  }
}
