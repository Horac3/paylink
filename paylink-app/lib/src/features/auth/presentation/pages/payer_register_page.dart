import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/error_banner.dart';
import '../../../../core/presentation/widgets/loading_button.dart';
import '../../application/payer_auth_controller.dart';

String? _validateNumber(String? v) {
  if (v == null || v.trim().isEmpty) return 'Phone number is required';
  if (!RegExp(r'^\d{9}$').hasMatch(v.trim())) {
    return 'Enter 9 digits after +265';
  }
  return null;
}

class PayerRegisterPage extends ConsumerStatefulWidget {
  const PayerRegisterPage({super.key});

  @override
  ConsumerState<PayerRegisterPage> createState() => _PayerRegisterPageState();
}

class _PayerRegisterPageState extends ConsumerState<PayerRegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _numberCtrl = TextEditingController();

  @override
  void dispose() {
    _numberCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final number = _numberCtrl.text.trim();
    final msisdn = '+265$number';
    final ok = await ref
        .read(payerAuthControllerProvider.notifier)
        .sendOtp(msisdn: msisdn);
    if (ok && mounted) {
      context.push('${Routes.payerOtp}?msisdn=%2B265$number');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(payerAuthControllerProvider);
    final isLoading = authState is AsyncLoading;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Pay with PayLink')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 8),
                Text(
                  'Enter your mobile number to continue',
                  style: AppTextStyles.bodyLarge
                      .copyWith(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 24),
                if (authState is AsyncError) ...[
                  ErrorBanner(message: authState.error.toString()),
                  const SizedBox(height: 16),
                ],
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 56,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.divider),
                        borderRadius: BorderRadius.circular(8),
                        color: Colors.white,
                      ),
                      alignment: Alignment.center,
                      child: Text('+265 ',
                          style: AppTextStyles.bodyLarge
                              .copyWith(color: AppColors.textPrimary)),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextFormField(
                        controller: _numberCtrl,
                        keyboardType: TextInputType.number,
                        textInputAction: TextInputAction.done,
                        maxLength: 9,
                        decoration: const InputDecoration(
                          labelText: 'Phone number',
                          hintText: '999123456',
                          counterText: '',
                        ),
                        validator: _validateNumber,
                        onFieldSubmitted: (_) => _submit(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 52,
                  child: LoadingButton(
                    label: 'Send OTP',
                    isLoading: isLoading,
                    onPressed: _submit,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
