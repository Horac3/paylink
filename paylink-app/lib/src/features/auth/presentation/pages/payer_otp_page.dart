import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/error_banner.dart';
import '../../../../core/presentation/widgets/loading_button.dart';
import '../../application/payer_auth_controller.dart';

class PayerOtpPage extends ConsumerStatefulWidget {
  final String msisdn;
  const PayerOtpPage({super.key, required this.msisdn});

  @override
  ConsumerState<PayerOtpPage> createState() => _PayerOtpPageState();
}

class _PayerOtpPageState extends ConsumerState<PayerOtpPage> {
  final _formKey = GlobalKey<FormState>();
  final _otpCtrl = TextEditingController();

  int _resendCountdown = 30;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  @override
  void dispose() {
    _otpCtrl.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCountdown() {
    _resendCountdown = 30;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendCountdown <= 1) {
        t.cancel();
        if (mounted) setState(() => _resendCountdown = 0);
      } else {
        if (mounted) setState(() => _resendCountdown--);
      }
    });
  }

  Future<void> _verify() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final ok = await ref
        .read(payerAuthControllerProvider.notifier)
        .verifyOtp(msisdn: widget.msisdn, otp: _otpCtrl.text.trim());
    if (ok && mounted) context.go(Routes.payerHome);
  }

  Future<void> _resend() async {
    await ref
        .read(payerAuthControllerProvider.notifier)
        .sendOtp(msisdn: widget.msisdn);
    _startCountdown();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(payerAuthControllerProvider);
    final isLoading = authState is AsyncLoading;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Verify Phone')),
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
                  'Enter the 6-digit code sent to ${widget.msisdn}',
                  style: AppTextStyles.bodyLarge
                      .copyWith(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 24),
                if (authState is AsyncError) ...[
                  ErrorBanner(message: authState.error.toString()),
                  const SizedBox(height: 16),
                ],
                TextFormField(
                  controller: _otpCtrl,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  maxLength: 6,
                  style: AppTextStyles.headlineLarge,
                  decoration: const InputDecoration(
                    hintText: '------',
                    counterText: '',
                  ),
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Enter the OTP';
                    if (!RegExp(r'^\d{6}$').hasMatch(v.trim())) {
                      return 'Enter a valid 6-digit code';
                    }
                    return null;
                  },
                  onFieldSubmitted: (_) => _verify(),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 52,
                  child: LoadingButton(
                    label: 'Verify',
                    isLoading: isLoading,
                    onPressed: _verify,
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: _resendCountdown > 0
                      ? Text(
                          'Resend OTP in ${_resendCountdown}s',
                          style: AppTextStyles.bodySmall
                              .copyWith(color: AppColors.textSecondary),
                        )
                      : TextButton(
                          onPressed: isLoading ? null : _resend,
                          child: Text(
                            'Resend OTP',
                            style: AppTextStyles.labelLarge
                                .copyWith(color: AppColors.primary),
                          ),
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
