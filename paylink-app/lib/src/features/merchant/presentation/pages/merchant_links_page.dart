import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/dto/link_dto.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_links_controller.dart';

class MerchantLinksPage extends ConsumerWidget {
  const MerchantLinksPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final linksAsync = ref.watch(merchantLinksControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Links'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Create link',
            onPressed: () => context.push(Routes.merchantCreateLink),
          ),
        ],
      ),
      body: linksAsync.when(
        loading: () => ListView.builder(
          itemCount: 6,
          itemBuilder: (_, __) => const ShimmerListItem(),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: ErrorBanner(
            message: e.toString(),
            onRetry: () => ref.invalidate(merchantLinksControllerProvider),
          ),
        ),
        data: (links) {
          if (links.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.link,
              title: 'No links yet',
              subtitle: 'Create your first payment link to get started.',
              action: ElevatedButton.icon(
                onPressed: () => context.push(Routes.merchantCreateLink),
                icon: const Icon(Icons.add),
                label: const Text('Create Link'),
              ),
            );
          }
          final notifier = ref.read(merchantLinksControllerProvider.notifier);
          return PaginatedListView<PaymentLinkDto>(
            items: links,
            hasMore: notifier.hasMore,
            onLoadMore: notifier.loadMore,
            itemBuilder: (ctx, link) => _LinkCard(link: link),
          );
        },
      ),
    );
  }
}

class _LinkCard extends ConsumerWidget {
  final PaymentLinkDto link;
  const _LinkCard({required this.link});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Dismissible(
      key: ValueKey(link.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: AppColors.error,
        child: const Icon(Icons.archive, color: Colors.white),
      ),
      confirmDismiss: (_) async {
        return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Cancel Link'),
            content:
                Text('Cancel link "${link.slug}"? It will no longer be usable.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Keep'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: TextButton.styleFrom(foregroundColor: AppColors.error),
                child: const Text('Cancel'),
              ),
            ],
          ),
        );
      },
      onDismissed: (_) {
        ref
            .read(merchantLinksControllerProvider.notifier)
            .cancelLink(link.id);
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: ListTile(
          title: Text(link.slug, style: AppTextStyles.titleMedium),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 4),
              Row(
                children: [
                  _TypeBadge(type: link.type),
                  const SizedBox(width: 8),
                  StatusBadge(
                    label: link.status,
                    status: _badgeStatus(link.status),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              if (link.amount != null)
                MoneyText(
                  amount: link.amount!,
                  currency: link.currency,
                  size: MoneySize.small,
                )
              else
                Text('Open amount', style: AppTextStyles.bodySmall),
            ],
          ),
          isThreeLine: true,
          trailing:
              const Icon(Icons.chevron_right, color: AppColors.textSecondary),
          onTap: () => context.push('/merchant/links/${link.id}'),
        ),
      ),
    );
  }

  BadgeStatus _badgeStatus(String s) => switch (s.toUpperCase()) {
        'ACTIVE' => BadgeStatus.success,
        'ARCHIVED' => BadgeStatus.cancelled,
        _ => BadgeStatus.pending,
      };
}

class _TypeBadge extends StatelessWidget {
  final String type;
  const _TypeBadge({required this.type});

  @override
  Widget build(BuildContext context) {
    final color = switch (type.toUpperCase()) {
      'FIXED' => AppColors.primary,
      'OPEN' => AppColors.secondary,
      'SUBSCRIPTION' => AppColors.warning,
      _ => AppColors.textSecondary,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        type,
        style: AppTextStyles.labelMedium.copyWith(color: color),
      ),
    );
  }
}
