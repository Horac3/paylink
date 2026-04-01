import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../application/payer_history_controller.dart';

// One-off provider for msisdnHint — scoped to this file
final _msisdnHintProvider = FutureProvider.autoDispose<String?>((ref) {
  return ref.read(secureStorageProvider).getMsisdnHint();
});

class PayerHomePage extends ConsumerWidget {
  const PayerHomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final connectivityAsync = ref.watch(connectivityProvider);
    final isOnline = connectivityAsync.valueOrNull ?? true;
    final historyAsync = ref.watch(payerHistoryControllerProvider);
    final msisdnHintAsync = ref.watch(_msisdnHintProvider);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        leading: null,
        title: const Text('PayLink'),
      ),
      body: Column(
        children: [
          if (!isOnline)
            Container(
              width: double.infinity,
              color: AppColors.warning,
              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
              child: Text(
                'No internet connection — showing cached data',
                style: AppTextStyles.bodySmall.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
            ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Greeting card
                Card(
                  color: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Ready to pay?',
                          style: AppTextStyles.headlineMedium
                              .copyWith(color: AppColors.onPrimary),
                        ),
                        const SizedBox(height: 6),
                        msisdnHintAsync.when(
                          data: (hint) => Text(
                            hint ?? '',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.onPrimary.withValues(alpha: 0.8),
                            ),
                          ),
                          loading: () => const SizedBox.shrink(),
                          error: (_, __) => const SizedBox.shrink(),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // QR scan button
                GestureDetector(
                  onTap: () => context.push(Routes.payerQrScanner),
                  child: Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.qr_code_scanner,
                              size: 48,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Scan QR Code',
                            style: AppTextStyles.titleMedium
                                .copyWith(color: AppColors.primary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Point your camera at a PayLink QR code',
                            style: AppTextStyles.bodySmall
                                .copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Recent Payments section
                Text('Recent Payments', style: AppTextStyles.titleMedium),
                const SizedBox(height: 12),
                historyAsync.when(
                  data: (state) {
                    final recent = state.items.take(3).toList();
                    if (recent.isEmpty) {
                      return const EmptyStateWidget(
                        icon: Icons.history,
                        title: 'No payments yet',
                        subtitle: 'Your recent payments will appear here',
                      );
                    }
                    return Column(
                      children: recent.map((tx) {
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: const Icon(
                              Icons.receipt_long,
                              color: AppColors.primary,
                            ),
                            title: MoneyText(
                              amount: tx.amount,
                              currency: tx.currency,
                              size: MoneySize.small,
                            ),
                            subtitle: Text(
                              _formatDate(tx.createdAt),
                              style: AppTextStyles.bodySmall
                                  .copyWith(color: AppColors.textSecondary),
                            ),
                            trailing: StatusBadge(
                              label: tx.status,
                              status: _toBadgeStatus(tx.status),
                            ),
                          ),
                        );
                      }).toList(),
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (_, __) => Text(
                    'Could not load history',
                    style: AppTextStyles.bodySmall
                        .copyWith(color: AppColors.textSecondary),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  BadgeStatus _toBadgeStatus(String status) {
    return switch (status.toUpperCase()) {
      'COMPLETED' => BadgeStatus.success,
      'PENDING' => BadgeStatus.pending,
      'PROCESSING' => BadgeStatus.processing,
      'FAILED' => BadgeStatus.failed,
      'CANCELLED' => BadgeStatus.cancelled,
      _ => BadgeStatus.pending,
    };
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      return '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
    } catch (_) {
      return iso;
    }
  }
}
