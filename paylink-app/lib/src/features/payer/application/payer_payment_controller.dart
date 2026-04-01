import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/transaction_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'payer_payment_controller.g.dart';

// ── Sealed payment state ───────────────────────────────────────────────────
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

// ── Controller ─────────────────────────────────────────────────────────────
@riverpod
class PayerPaymentController extends _$PayerPaymentController {
  @override
  Future<PaymentFlowState> build() async => const PaymentIdle();

  Future<void> initiate({
    required String linkSlug,
    String? amount,
  }) async {
    // Step 1: Awaiting biometric
    state = const AsyncData(PaymentAwaitingBiometric());

    // Step 2: Biometric gate — NO bypass
    final biometric = ref.read(biometricServiceProvider);
    final authenticated =
        await biometric.authenticate(reason: 'Confirm payment');
    if (!authenticated) {
      state = const AsyncData(
          PaymentFailed('Biometric authentication cancelled'));
      return;
    }

    // Step 3: Processing
    state = const AsyncData(PaymentProcessing());

    try {
      // Step 4: Get payer session token
      final storage = ref.read(secureStorageProvider);
      final token = await storage.getPayerSessionToken();
      if (token == null) {
        state = const AsyncData(PaymentFailed('Session expired. Please sign in again.'));
        return;
      }

      // Step 5: Initiate payment
      final api = ref.read(paylinkApiProvider);
      final response = await api.initiatePayment(
        InitiatePaymentRequestDto(
          linkSlug: linkSlug,
          payerSessionToken: token,
          amount: amount,
        ),
      );

      final transactionId = response.transactionId;

      // Step 6-9: Poll status every 3 seconds, up to 10 attempts
      const maxAttempts = 10;
      for (var attempt = 0; attempt < maxAttempts; attempt++) {
        await Future<void>.delayed(const Duration(seconds: 3));

        final statusDto = await api.getPaymentStatus(transactionId);

        if (statusDto.status == 'COMPLETED') {
          state = AsyncData(PaymentSuccess(transactionId));
          return;
        } else if (statusDto.status == 'FAILED') {
          state = AsyncData(
              PaymentFailed(statusDto.failureReason ?? 'Payment failed'));
          return;
        }
        // Otherwise keep polling (PENDING / PROCESSING)
      }

      // Polling exhausted
      state = const AsyncData(PaymentFailed('Payment timed out'));
    } catch (e) {
      state = AsyncData(PaymentFailed(e.toString()));
    }
  }

  void reset() {
    state = const AsyncData(PaymentIdle());
  }
}
