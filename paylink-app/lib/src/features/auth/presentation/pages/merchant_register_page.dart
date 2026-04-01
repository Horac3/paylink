import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/presentation/navigation/routes.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/error_banner.dart';
import '../../../../core/presentation/widgets/loading_button.dart';
import '../../application/merchant_auth_controller.dart';

String? _requiredField(String? v, String label) {
  if (v == null || v.trim().isEmpty) return '$label is required';
  return null;
}

String? _validateEmail(String? v) {
  final base = _requiredField(v, 'Email');
  if (base != null) return base;
  if (!v!.contains('@')) return 'Enter a valid email address';
  return null;
}

String? _validatePhone(String? v) {
  final base = _requiredField(v, 'Phone number');
  if (base != null) return base;
  final cleaned = v!.trim();
  if (!RegExp(r'^\+\d+$').hasMatch(cleaned)) {
    return 'Phone must start with + followed by digits';
  }
  return null;
}

String? _validatePassword(String? v) {
  if (v == null || v.isEmpty) return 'Password is required';
  if (v.length < 8) return 'Password must be at least 8 characters';
  return null;
}

class MerchantRegisterPage extends ConsumerStatefulWidget {
  const MerchantRegisterPage({super.key});

  @override
  ConsumerState<MerchantRegisterPage> createState() =>
      _MerchantRegisterPageState();
}

class _MerchantRegisterPageState extends ConsumerState<MerchantRegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _businessNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();

  @override
  void dispose() {
    _businessNameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final ok = await ref
        .read(merchantAuthControllerProvider.notifier)
        .register(
          businessName: _businessNameCtrl.text.trim(),
          email: _emailCtrl.text.trim(),
          password: _passwordCtrl.text,
          msisdn: _phoneCtrl.text.trim(),
        );
    if (ok && mounted) context.go(Routes.merchantDashboard);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(merchantAuthControllerProvider);
    final isLoading = authState is AsyncLoading;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Create Account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 8),
                if (authState is AsyncError) ...[
                  ErrorBanner(message: authState.error.toString()),
                  const SizedBox(height: 16),
                ],
                TextFormField(
                  controller: _businessNameCtrl,
                  textInputAction: TextInputAction.next,
                  decoration:
                      const InputDecoration(labelText: 'Business Name'),
                  validator: (v) => _requiredField(v, 'Business name'),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(labelText: 'Email'),
                  validator: _validateEmail,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _phoneCtrl,
                  keyboardType: TextInputType.phone,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText: 'Phone (MSISDN)',
                    hintText: '+265xxxxxxxxx',
                  ),
                  validator: _validatePhone,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordCtrl,
                  obscureText: true,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(labelText: 'Password'),
                  validator: _validatePassword,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _confirmCtrl,
                  obscureText: true,
                  textInputAction: TextInputAction.done,
                  decoration:
                      const InputDecoration(labelText: 'Confirm Password'),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Please confirm your password';
                    if (v != _passwordCtrl.text) return 'Passwords do not match';
                    return null;
                  },
                  onFieldSubmitted: (_) => _submit(),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 52,
                  child: LoadingButton(
                    label: 'Create Account',
                    isLoading: isLoading,
                    onPressed: _submit,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Already have an account?',
                        style: AppTextStyles.bodyMedium),
                    TextButton(
                      onPressed: () => context.pop(),
                      child: Text(
                        'Sign In',
                        style: AppTextStyles.labelLarge
                            .copyWith(color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
