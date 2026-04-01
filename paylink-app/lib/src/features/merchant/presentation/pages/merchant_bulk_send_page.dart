import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/dto/link_dto.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';

class MerchantBulkSendPage extends ConsumerStatefulWidget {
  final String? linkId;
  const MerchantBulkSendPage({super.key, this.linkId});

  @override
  ConsumerState<MerchantBulkSendPage> createState() =>
      _MerchantBulkSendPageState();
}

class _MerchantBulkSendPageState extends ConsumerState<MerchantBulkSendPage> {
  final _formKey = GlobalKey<FormState>();
  final _numbersCtrl = TextEditingController();
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _numbersCtrl.dispose();
    super.dispose();
  }

  List<String> get _parsedNumbers => _numbersCtrl.text
      .split('\n')
      .map((l) => l.trim())
      .where((l) => l.isNotEmpty)
      .toList();

  String? _validateNumbers(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Enter at least one mobile number';
    }
    final lines = value.split('\n').map((l) => l.trim()).where((l) => l.isNotEmpty);
    for (final line in lines) {
      if (!RegExp(r'^\+265\d{9}$').hasMatch(line)) {
        return 'Each number must be in format +265XXXXXXXXX (got: $line)';
      }
    }
    return null;
  }

  Future<void> _send() async {
    if (!_formKey.currentState!.validate()) return;
    final numbers = _parsedNumbers;
    final linkId = widget.linkId ?? '';
    if (linkId.isEmpty) {
      setState(() => _error = 'No link selected. Go back and try again.');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await ref.read(paylinkApiProvider).bulkSend(
            BulkSendRequestDto(linkId: linkId, msisdns: numbers),
          );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sent to ${numbers.length} recipients')),
        );
        context.pop();
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final count = _parsedNumbers.length;

    return Scaffold(
      appBar: AppBar(title: const Text('Bulk Send')),
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
              Text(
                'Enter one mobile number per line (+265XXXXXXXXX)',
                style: AppTextStyles.bodyMedium,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _numbersCtrl,
                maxLines: 10,
                decoration: const InputDecoration(
                  hintText: '+265991234567\n+265881234567',
                  alignLabelWithHint: true,
                ),
                keyboardType: TextInputType.multiline,
                validator: _validateNumbers,
                onChanged: (_) => setState(() {}),
              ),
              const SizedBox(height: 12),
              if (count > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.people,
                          color: AppColors.primary, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        '$count recipient${count == 1 ? '' : 's'}',
                        style: AppTextStyles.labelMedium
                            .copyWith(color: AppColors.primary),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),
              LoadingButton(
                onPressed: _send,
                isLoading: _isLoading,
                label: 'Send',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
