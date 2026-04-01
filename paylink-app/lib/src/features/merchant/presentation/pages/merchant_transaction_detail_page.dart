import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/data/dto/transaction_dto.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_refund_controller.dart';

final _txDetailProvider =
    FutureProvider.family<TransactionDto, String>((ref, id) {
  return ref.read(paylinkApiProvider).getTransactionDetail(id);
});

class MerchantTransactionDetailPage extends ConsumerWidget {
  final String transactionId;
  const MerchantTransactionDetailPage(
      {super.key, required this.transactionId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final txAsync = ref.watch(_txDetailProvider(transactionId));

    return Scaffold(
      appBar: AppBar(title: const Text('Transaction Detail')),
      body: txAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: ErrorBanner(
            message: e.toString(),
            onRetry: () =>
                ref.invalidate(_txDetailProvider(transactionId)),
          ),
        ),
        data: (tx) => _TxDetailBody(tx: tx),
      ),
    );
  }
}

class _TxDetailBody extends StatelessWidget {
  final TransactionDto tx;
  const _TxDetailBody({required this.tx});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Amount card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Amount', style: AppTextStyles.bodySmall),
                const SizedBox(height: 8),
                MoneyText(
                  amount: tx.amount,
                  currency: tx.currency,
                  size: MoneySize.large,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Detail rows card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _DetailRow(
                  label: 'Status',
                  child: StatusBadge(
                    label: tx.status,
                    status: _badgeStatus(tx.status),
                  ),
                ),
                const Divider(height: 24),
                _DetailRow(
                  label: 'Phone',
                  value: _maskMsisdn(tx.msisdnHint),
                ),
                const Divider(height: 24),
                _DetailRow(
                  label: 'Date',
                  value: _fmtDate(tx.createdAt),
                ),
                if (tx.linkTitle != null) ...[
                  const Divider(height: 24),
                  _DetailRow(label: 'Link', value: tx.linkTitle!),
                ],
                if (tx.status.toUpperCase() == 'FAILED' &&
                    tx.failureReason != null) ...[
                  const Divider(height: 24),
                  _DetailRow(
                    label: 'Failure Reason',
                    value: tx.failureReason!,
                    valueStyle: AppTextStyles.bodyMedium
                        .copyWith(color: AppColors.error),
                  ),
                ],
              ],
            ),
          ),
        ),

        // Refund button — only for COMPLETED
        if (tx.status.toUpperCase() == 'COMPLETED') ...[
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: () => _showRefundSheet(context, tx.id),
            icon: const Icon(Icons.undo, color: AppColors.warning),
            label: const Text('Request Refund'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.warning,
              side: const BorderSide(color: AppColors.warning),
            ),
          ),
        ],
      ],
    );
  }

  void _showRefundSheet(BuildContext context, String txId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => RefundRequestBottomSheet(transactionId: txId),
    );
  }

  BadgeStatus _badgeStatus(String s) => switch (s.toUpperCase()) {
        'COMPLETED' => BadgeStatus.success,
        'PENDING' => BadgeStatus.pending,
        'PROCESSING' => BadgeStatus.processing,
        'FAILED' => BadgeStatus.failed,
        _ => BadgeStatus.cancelled,
      };

  String _maskMsisdn(String hint) {
    if (hint.length >= 4) {
      return '+265 *** *** ${hint.substring(hint.length - 3)}';
    }
    return hint;
  }

  String _fmtDate(String iso) {
    try {
      final d = DateTime.parse(iso).toLocal();
      return '${d.day}/${d.month}/${d.year} ${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return iso;
    }
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String? value;
  final Widget? child;
  final TextStyle? valueStyle;

  const _DetailRow({
    required this.label,
    this.value,
    this.child,
    this.valueStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(label, style: AppTextStyles.bodySmall),
        ),
        Expanded(
          child: child ??
              Text(
                value ?? '-',
                style: valueStyle ?? AppTextStyles.bodyMedium,
                textAlign: TextAlign.end,
              ),
        ),
      ],
    );
  }
}

// ---------------------------------------------------------------------------
// Refund bottom sheet
// ---------------------------------------------------------------------------

class RefundRequestBottomSheet extends ConsumerStatefulWidget {
  final String transactionId;
  const RefundRequestBottomSheet({super.key, required this.transactionId});

  @override
  ConsumerState<RefundRequestBottomSheet> createState() =>
      _RefundRequestBottomSheetState();
}

class _RefundRequestBottomSheetState
    extends ConsumerState<RefundRequestBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _reasonCtrl = TextEditingController();
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _reasonCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final ok = await ref
        .read(merchantRefundControllerProvider.notifier)
        .requestRefund(
          transactionId: widget.transactionId,
          reason: _reasonCtrl.text.trim(),
        );
    if (!mounted) return;
    if (ok) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Refund requested')),
      );
    } else {
      final err = ref.read(merchantRefundControllerProvider).error;
      setState(() {
        _isLoading = false;
        _error = err?.toString() ?? 'Failed to request refund';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Request Refund', style: AppTextStyles.titleLarge),
            const SizedBox(height: 16),
            if (_error != null) ...[
              ErrorBanner(message: _error!),
              const SizedBox(height: 12),
            ],
            TextFormField(
              controller: _reasonCtrl,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Reason',
                hintText: 'Describe why a refund is needed...',
                alignLabelWithHint: true,
              ),
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Reason is required';
                if (v.trim().length < 10) {
                  return 'Please provide at least 10 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 20),
            LoadingButton(
              onPressed: _submit,
              isLoading: _isLoading,
              label: 'Submit Refund',
            ),
          ],
        ),
      ),
    );
  }
}
