import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/payer_history_controller.dart';

class PayerHistoryPage extends ConsumerWidget {
  const PayerHistoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(payerHistoryControllerProvider);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Payment History'),
      ),
      body: historyAsync.when(
        data: (state) {
          if (state.items.isEmpty) {
            return const EmptyStateWidget(
              icon: Icons.history,
              title: 'No payments yet',
              subtitle: 'Your payment history will appear here',
            );
          }
          return PaginatedListView<dynamic>(
            items: state.items,
            hasMore: state.hasMore,
            isLoadingMore: false,
            onLoadMore: () =>
                ref.read(payerHistoryControllerProvider.notifier).loadMore(),
            itemBuilder: (context, item) {
              return Card(
                margin:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: ListTile(
                  leading: const Icon(
                    Icons.receipt_long,
                    color: AppColors.primary,
                  ),
                  title: MoneyText(
                    amount: item.amount,
                    currency: item.currency,
                    size: MoneySize.small,
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (item.linkTitle != null)
                        Text(
                          item.linkTitle!,
                          style: AppTextStyles.bodySmall,
                        ),
                      Text(
                        _formatDate(item.createdAt),
                        style: AppTextStyles.bodySmall
                            .copyWith(color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  trailing: StatusBadge(
                    label: item.status,
                    status: _toBadgeStatus(item.status),
                  ),
                  isThreeLine: item.linkTitle != null,
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline,
                    size: 48, color: AppColors.error),
                const SizedBox(height: 16),
                Text(
                  'Could not load history',
                  style: AppTextStyles.titleMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  e.toString(),
                  style: AppTextStyles.bodySmall
                      .copyWith(color: AppColors.textSecondary),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => ref.invalidate(payerHistoryControllerProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
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
