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
  final _titleCtrl = TextEditingController();
  final _amountCtrl = TextEditingController();
  final _maxUsesCtrl = TextEditingController();

  String _type = 'FIXED';
  String _cycle = 'MONTHLY';
  bool _isLoading = false;
  String? _error;

  static const _types = ['FIXED', 'OPEN', 'SUBSCRIPTION'];
  static const _cycles = ['WEEKLY', 'MONTHLY'];

  @override
  void dispose() {
    _titleCtrl.dispose();
    _amountCtrl.dispose();
    _maxUsesCtrl.dispose();
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
        title: _titleCtrl.text.trim(),
        type: _type,
        amount: _type == 'FIXED' ? _amountCtrl.text.trim() : null,
        currency: 'MWK',
        maxUses: _maxUsesCtrl.text.isNotEmpty
            ? int.tryParse(_maxUsesCtrl.text.trim())
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
              TextFormField(
                controller: _titleCtrl,
                decoration: const InputDecoration(
                  labelText: 'Title',
                  hintText: 'e.g. School Fees Payment',
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Title is required' : null,
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _type,
                decoration: const InputDecoration(labelText: 'Type'),
                items: _types
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (v) => setState(() => _type = v!),
              ),
              const SizedBox(height: 16),
              if (_type == 'FIXED') ...[
                TextFormField(
                  controller: _amountCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Amount (MWK)',
                    hintText: '0.00',
                  ),
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  validator: (v) {
                    if (_type != 'FIXED') return null;
                    if (v == null || v.trim().isEmpty) {
                      return 'Amount is required for fixed links';
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
              if (_type == 'SUBSCRIPTION') ...[
                DropdownButtonFormField<String>(
                  value: _cycle,
                  decoration: const InputDecoration(labelText: 'Billing Cycle'),
                  items: _cycles
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setState(() => _cycle = v!),
                ),
                const SizedBox(height: 16),
              ],
              TextFormField(
                controller: _maxUsesCtrl,
                decoration: const InputDecoration(
                  labelText: 'Max Uses (optional)',
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
              const SizedBox(height: 32),
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
            ],
          ),
        ),
      ),
    );
  }
}
