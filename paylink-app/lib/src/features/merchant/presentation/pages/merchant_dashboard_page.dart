import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/dto/transaction_dto.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_transactions_controller.dart';

class MerchantDashboardPage extends ConsumerWidget {
  const MerchantDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final txAsync = ref.watch(merchantTransactionsControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              await ref.read(secureStorageProvider).clearAll();
              if (context.mounted) context.go(Routes.welcome);
            },
          ),
        ],
      ),
      body: txAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: ErrorBanner(message: e.toString()),
        ),
        data: (txState) {
          final items = txState.items;
          final recent = items.take(5).toList();
          final successCount =
              items.where((t) => t.status == 'COMPLETED').length;

          return RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () =>
                ref.refresh(merchantTransactionsControllerProvider.future),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _WelcomeCard(),
                const SizedBox(height: 16),
                _StatsRow(
                    totalCount: items.length, successCount: successCount),
                const SizedBox(height: 24),
                Text('Recent Transactions',
                    style: AppTextStyles.titleLarge),
                const SizedBox(height: 12),
                if (recent.isEmpty)
                  const EmptyStateWidget(
                    icon: Icons.receipt_long_outlined,
                    title: 'No transactions yet',
                  )
                else
                  ...recent.map((tx) => _TxTile(tx: tx)),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(Routes.merchantCreateLink),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.onPrimary,
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _WelcomeCard extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.secondary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Welcome back',
              style: AppTextStyles.bodyMedium
                  .copyWith(color: AppColors.onPrimary.withValues(alpha: 0.8))),
          const SizedBox(height: 4),
          Text('Dashboard',
              style: AppTextStyles.headlineMedium
                  .copyWith(color: AppColors.onPrimary)),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final int totalCount;
  final int successCount;

  const _StatsRow({required this.totalCount, required this.successCount});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            label: 'Total',
            value: '$totalCount',
            icon: Icons.receipt_long,
            color: AppColors.secondary,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Successful',
            value: '$successCount',
            icon: Icons.check_circle_outline,
            color: AppColors.success,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Failed',
            value: '${totalCount - successCount}',
            icon: Icons.cancel_outlined,
            color: AppColors.error,
          ),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(value,
              style:
                  AppTextStyles.titleLarge.copyWith(color: AppColors.textPrimary)),
          Text(label, style: AppTextStyles.bodySmall),
        ],
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
      margin: const EdgeInsets.only(bottom: 8),
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
        subtitle: Text(
          _fmtDate(tx.createdAt),
          style: AppTextStyles.bodySmall,
        ),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
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
