import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/dto/link_dto.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_links_controller.dart';

final _linkDetailProvider =
    FutureProvider.family<LinkDetailDto, String>((ref, id) {
  return ref.read(paylinkApiProvider).getLinkDetail(id);
});

class MerchantLinkDetailPage extends ConsumerWidget {
  final String linkId;
  const MerchantLinkDetailPage({super.key, required this.linkId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(_linkDetailProvider(linkId));

    return Scaffold(
      appBar: AppBar(
        title: detailAsync.maybeWhen(
          data: (d) => Text(d.title),
          orElse: () => const Text('Link Detail'),
        ),
        actions: [
          detailAsync.maybeWhen(
            data: (d) => IconButton(
              icon: const Icon(Icons.copy),
              tooltip: 'Copy link',
              onPressed: () {
                final url = d.deepLink ?? '';
                Clipboard.setData(ClipboardData(text: url));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Link copied to clipboard')),
                );
              },
            ),
            orElse: () => const SizedBox.shrink(),
          ),
        ],
      ),
      body: detailAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: ErrorBanner(
            message: e.toString(),
            onRetry: () => ref.invalidate(_linkDetailProvider(linkId)),
          ),
        ),
        data: (link) => _LinkDetailBody(link: link),
      ),
    );
  }
}

class _LinkDetailBody extends ConsumerWidget {
  final LinkDetailDto link;
  const _LinkDetailBody({required this.link});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Status card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                StatusBadge(
                  label: link.status,
                  status: _badgeStatus(link.status),
                ),
                const SizedBox(width: 12),
                _TypeBadge(type: link.type),
                const Spacer(),
                Text(
                  _fmtDate(link.createdAt),
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Amount section
        if (link.amount != null) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Amount', style: AppTextStyles.bodySmall),
                  const SizedBox(height: 8),
                  MoneyText(
                    amount: link.amount!,
                    currency: link.currency,
                    size: MoneySize.large,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],

        // Deep link
        if (link.deepLink != null) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Payment Link', style: AppTextStyles.bodySmall),
                  const SizedBox(height: 8),
                  TextFormField(
                    initialValue: link.deepLink,
                    readOnly: true,
                    style: AppTextStyles.bodyMedium,
                    decoration: InputDecoration(
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.copy),
                        onPressed: () {
                          Clipboard.setData(
                              ClipboardData(text: link.deepLink!));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Link copied to clipboard')),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],

        // Usage
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.people_outline,
                    color: AppColors.textSecondary, size: 20),
                const SizedBox(width: 8),
                Text('Usage', style: AppTextStyles.bodyMedium),
                const Spacer(),
                Text(
                  link.maxUses != null
                      ? '${link.useCount ?? 0} / ${link.maxUses} uses'
                      : '${link.useCount ?? 0} uses (Unlimited)',
                  style: AppTextStyles.labelMedium,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Bulk Send button
        OutlinedButton.icon(
          onPressed: () => context.push(
            '${Routes.merchantBulkSend}?linkId=${link.id}',
          ),
          icon: const Icon(Icons.send),
          label: const Text('Bulk Send'),
        ),
        const SizedBox(height: 12),

        // Archive button
        OutlinedButton.icon(
          onPressed: () async {
            final confirmed = await showDialog<bool>(
              context: context,
              builder: (ctx) => AlertDialog(
                title: const Text('Archive Link'),
                content: Text(
                    'Archive "${link.title}"? It will no longer be usable.'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx, false),
                    child: const Text('Cancel'),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(ctx, true),
                    style: TextButton.styleFrom(
                        foregroundColor: AppColors.error),
                    child: const Text('Archive'),
                  ),
                ],
              ),
            );
            if (confirmed == true && context.mounted) {
              await ref
                  .read(merchantLinksControllerProvider.notifier)
                  .archiveLink(link.id);
              if (context.mounted) context.pop();
            }
          },
          icon: const Icon(Icons.archive, color: AppColors.error),
          label: const Text('Archive Link'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.error,
            side: const BorderSide(color: AppColors.error),
          ),
        ),
      ],
    );
  }

  BadgeStatus _badgeStatus(String s) => switch (s.toUpperCase()) {
        'ACTIVE' => BadgeStatus.success,
        'ARCHIVED' => BadgeStatus.cancelled,
        _ => BadgeStatus.pending,
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
