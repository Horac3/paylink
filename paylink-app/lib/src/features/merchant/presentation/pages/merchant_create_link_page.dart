import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/data/dto/link_dto.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_links_controller.dart';

class MerchantCreateLinkPage extends ConsumerStatefulWidget {
  const MerchantCreateLinkPage({super.key});

  @override
  ConsumerState<MerchantCreateLinkPage> createState() =>
      _MerchantCreateLinkPageState();
}

class _MerchantCreateLinkPageState
    extends ConsumerState<MerchantCreateLinkPage> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  final _maxCyclesCtrl = TextEditingController();

  String _type = 'INVOICE';
  String _recurrenceInterval = 'MONTHLY';
  bool _isLoading = false;
  String? _error;

  static const _types = [
    ('INVOICE', 'Invoice', 'One-time fixed amount'),
    ('DONATION', 'Donation', 'Any amount, payer decides'),
    ('REQUEST', 'Request', 'Request payment from someone'),
    ('SUBSCRIPTION', 'Subscription', 'Recurring payment'),
  ];

  static const _intervals = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  @override
  void dispose() {
    _descriptionCtrl.dispose();
    _amountCtrl.dispose();
    _maxCyclesCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final dto = CreateLinkRequestDto(
        type: _type,
        currency: 'MWK',
        description: _descriptionCtrl.text.trim().isEmpty
            ? null
            : _descriptionCtrl.text.trim(),
        amount: (_type == 'INVOICE' || _type == 'SUBSCRIPTION' || _type == 'REQUEST')
            ? _amountCtrl.text.trim()
            : null,
        recurrenceInterval:
            _type == 'SUBSCRIPTION' ? _recurrenceInterval : null,
        maxCycles: _type == 'SUBSCRIPTION' && _maxCyclesCtrl.text.isNotEmpty
            ? int.tryParse(_maxCyclesCtrl.text.trim())
            : null,
      );
      await ref
          .read(merchantLinksControllerProvider.notifier)
          .createLink(dto);
      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Payment Link')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_error != null) ...[
                ErrorBanner(message: _error!),
                const SizedBox(height: 16),
              ],

              // Type selector
              Text('Link Type', style: AppTextStyles.labelMedium),
              const SizedBox(height: 8),
              ..._types.map(
                (t) => RadioListTile<String>(
                  value: t.$1,
                  groupValue: _type,
                  title: Text(t.$2, style: AppTextStyles.bodyMedium),
                  subtitle: Text(t.$3, style: AppTextStyles.bodySmall),
                  contentPadding: EdgeInsets.zero,
                  onChanged: (v) => setState(() => _type = v!),
                ),
              ),
              const SizedBox(height: 8),

              // Description
              TextFormField(
                controller: _descriptionCtrl,
                decoration: const InputDecoration(
                  labelText: 'Description (optional)',
                  hintText: 'e.g. School fees - Term 2',
                ),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 16),

              // Amount (not for DONATION)
              if (_type != 'DONATION') ...[
                TextFormField(
                  controller: _amountCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Amount (MWK)',
                    hintText: '0.00',
                  ),
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  validator: (v) {
                    if (_type == 'DONATION') return null;
                    if (v == null || v.trim().isEmpty) {
                      return 'Amount is required';
                    }
                    if (double.tryParse(v.trim()) == null) {
                      return 'Enter a valid amount';
                    }
                    return null;
                  },
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
              ],

              // Recurrence (SUBSCRIPTION only)
              if (_type == 'SUBSCRIPTION') ...[
                DropdownButtonFormField<String>(
                  value: _recurrenceInterval,
                  decoration: const InputDecoration(labelText: 'Billing Cycle'),
                  items: _intervals
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setState(() => _recurrenceInterval = v!),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _maxCyclesCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Max Cycles (optional)',
                    hintText: 'Leave blank for unlimited',
                  ),
                  keyboardType: TextInputType.number,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return null;
                    if (int.tryParse(v.trim()) == null) {
                      return 'Enter a whole number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
              ],

              Text(
                'Currency: MWK',
                style: AppTextStyles.bodySmall
                    .copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              LoadingButton(
                onPressed: _submit,
                isLoading: _isLoading,
                label: 'Create Link',
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
