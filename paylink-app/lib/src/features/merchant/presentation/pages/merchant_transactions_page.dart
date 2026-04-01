import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/dto/transaction_dto.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_transactions_controller.dart';

class MerchantTransactionsPage extends ConsumerWidget {
  const MerchantTransactionsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final txAsync = ref.watch(merchantTransactionsControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Transactions')),
      body: txAsync.when(
        loading: () => ListView.builder(
          itemCount: 6,
          itemBuilder: (_, __) => const ShimmerListItem(),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: ErrorBanner(
            message: e.toString(),
            onRetry: () =>
                ref.invalidate(merchantTransactionsControllerProvider),
          ),
        ),
        data: (txState) {
          if (txState.items.isEmpty) {
            return const EmptyStateWidget(
              icon: Icons.receipt_long,
              title: 'No transactions yet',
              subtitle: 'Transactions will appear here once payments are made.',
            );
          }
          final notifier =
              ref.read(merchantTransactionsControllerProvider.notifier);
          return PaginatedListView<TransactionDto>(
            items: txState.items,
            hasMore: txState.hasMore,
            onLoadMore: notifier.loadMore,
            itemBuilder: (ctx, tx) => _TxTile(tx: tx),
          );
        },
      ),
    );
  }
}

class _TxTile extends StatelessWidget {
  final TransactionDto tx;
  const _TxTile({required this.tx});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        leading: StatusBadge(
          label: tx.status,
          status: _badgeStatus(tx.status),
        ),
        title: MoneyText(
          amount: tx.amount,
          currency: tx.currency,
          size: MoneySize.small,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(tx.msisdnHint, style: AppTextStyles.bodySmall),
            Text(_fmtDate(tx.createdAt), style: AppTextStyles.bodySmall),
          ],
        ),
        isThreeLine: true,
        trailing:
            const Icon(Icons.chevron_right, color: AppColors.textSecondary),
        onTap: () => context.push('/merchant/transactions/${tx.id}'),
      ),
    );
  }

  BadgeStatus _badgeStatus(String s) => switch (s.toUpperCase()) {
        'COMPLETED' => BadgeStatus.success,
        'PENDING' => BadgeStatus.pending,
        'PROCESSING' => BadgeStatus.processing,
        'FAILED' => BadgeStatus.failed,
        _ => BadgeStatus.cancelled,
      };

  String _fmtDate(String iso) {
    try {
      final d = DateTime.parse(iso).toLocal();
      return '${d.day}/${d.month}/${d.year}';
    } catch (_) {
      return iso;
    }
  }
}
