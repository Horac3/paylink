import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../application/payer_payment_controller.dart';

class PayerPaymentConfirmPage extends ConsumerWidget {
  final String slug;
  const PayerPaymentConfirmPage({super.key, required this.slug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final paymentAsync = ref.watch(payerPaymentControllerProvider);

    ref.listen<AsyncValue<PaymentFlowState>>(
      payerPaymentControllerProvider,
      (_, next) {
        if (next is AsyncData) {
          final s = next.value;
          if (s is PaymentSuccess) {
            context.pushReplacement(Routes.payerHome);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Payment successful! Ref: ${s.transactionId}'),
                backgroundColor: AppColors.success,
              ),
            );
          } else if (s is PaymentFailed) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(s.reason),
                backgroundColor: AppColors.error,
              ),
            );
          }
        }
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm Payment'),
        leading: paymentAsync.maybeWhen(
          data: (s) =>
              s is PaymentProcessing || s is PaymentAwaitingBiometric
                  ? const SizedBox.shrink()
                  : null,
          orElse: () => null,
        ),
      ),
      body: paymentAsync.when(
        data: (state) => _buildBody(context, ref, state),
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Text(
            e.toString(),
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.error),
          ),
        ),
      ),
    );
  }

  Widget _buildBody(
      BuildContext context, WidgetRef ref, PaymentFlowState state) {
    return switch (state) {
      PaymentIdle() => _IdleView(slug: slug),
      PaymentAwaitingBiometric() => const _StatusView(
          icon: Icons.fingerprint,
          iconColor: AppColors.secondary,
          message: 'Waiting for biometric confirmation…',
        ),
      PaymentProcessing() => const _StatusView(
          icon: Icons.hourglass_top_rounded,
          iconColor: AppColors.warning,
          message: 'Processing payment…',
        ),
      PaymentSuccess(transactionId: final txId) => _SuccessView(txId: txId),
      PaymentFailed(reason: final reason) => _FailedView(
          reason: reason,
          onRetry: () => ref
              .read(payerPaymentControllerProvider.notifier)
              .reset(),
        ),
    };
  }
}

// ─── Idle: show slug + confirm button ─────────────────────────────────────────

class _IdleView extends ConsumerWidget {
  final String slug;
  const _IdleView({required this.slug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isOnline = ref.watch(connectivityProvider).value ?? true;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 16),
          Card(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Icon(
                    Icons.receipt_long,
                    size: 48,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Payment Request',
                    style: AppTextStyles.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Link: $slug',
                    style: AppTextStyles.bodyMedium
                        .copyWith(color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
          ),
          const Spacer(),
          Text(
            'Your biometric will be requested to confirm this payment.',
            style:
                AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          LoadingButton(
            label: 'Confirm Payment',
            onPressed: isOnline
                ? () {
                    HapticFeedback.mediumImpact();
                    ref
                        .read(payerPaymentControllerProvider.notifier)
                        .initiate(linkSlug: slug);
                  }
                : null,
          ),
          if (!isOnline) ...[
            const SizedBox(height: 8),
            Text(
              'You must be online to make a payment',
              style: AppTextStyles.bodySmall.copyWith(color: AppColors.error),
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: 12),
          LoadingButton(
            label: 'Cancel',
            outlined: true,
            onPressed: () => context.pop(),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ─── Status (biometric / processing) ──────────────────────────────────────────

class _StatusView extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String message;
  const _StatusView({
    required this.icon,
    required this.iconColor,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 72, color: iconColor),
          const SizedBox(height: 24),
          Text(message, style: AppTextStyles.titleMedium),
          const SizedBox(height: 16),
          const CircularProgressIndicator(),
        ],
      ),
    );
  }
}

// ─── Success ───────────────────────────────────────────────────────────────────

class _SuccessView extends StatelessWidget {
  final String txId;
  const _SuccessView({required this.txId});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, size: 80, color: AppColors.success),
            const SizedBox(height: 24),
            Text('Payment Successful!', style: AppTextStyles.headlineMedium),
            const SizedBox(height: 8),
            Text(
              'Ref: $txId',
              style: AppTextStyles.bodySmall
                  .copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.go(Routes.payerHome),
                child: const Text('Back to Home'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Failed ────────────────────────────────────────────────────────────────────

class _FailedView extends StatelessWidget {
  final String reason;
  final VoidCallback onRetry;
  const _FailedView({required this.reason, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cancel, size: 80, color: AppColors.error),
            const SizedBox(height: 24),
            Text('Payment Failed', style: AppTextStyles.headlineMedium),
            const SizedBox(height: 8),
            Text(
              reason,
              style: AppTextStyles.bodyMedium
                  .copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onRetry,
                child: const Text('Try Again'),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => context.go(Routes.payerHome),
                child: const Text('Back to Home'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
