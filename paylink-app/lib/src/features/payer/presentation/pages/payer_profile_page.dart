import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/data/providers/core_providers.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/navigation/routes.dart';

final _msisdnHintProvider = FutureProvider.autoDispose<String?>((ref) {
  return ref.read(secureStorageProvider).getMsisdnHint();
});

class PayerProfilePage extends ConsumerWidget {
  const PayerProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final msisdnHintAsync = ref.watch(_msisdnHintProvider);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Profile'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 16),
          // Avatar + hint
          Center(
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.person,
                    size: 44,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 12),
                msisdnHintAsync.when(
                  data: (hint) => Text(
                    hint ?? '',
                    style: AppTextStyles.titleMedium,
                  ),
                  loading: () => const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          // Info section
          Text('Account', style: AppTextStyles.labelLarge),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                _ProfileTile(
                  icon: Icons.phone_outlined,
                  title: 'Mobile Number',
                  subtitle: msisdnHintAsync.valueOrNull ?? '••••••••',
                ),
                const Divider(height: 1, indent: 56),
                const _ProfileTile(
                  icon: Icons.security_outlined,
                  title: 'Biometric Auth',
                  subtitle: 'Required for all payments',
                  trailing: Icon(
                    Icons.check_circle,
                    color: AppColors.success,
                    size: 20,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('Security', style: AppTextStyles.labelLarge),
          const SizedBox(height: 8),
          const Card(
            child: _ProfileTile(
              icon: Icons.info_outline,
              title: 'Privacy',
              subtitle: 'Your MSISDN is never stored on this device',
            ),
          ),
          const SizedBox(height: 32),
          // Sign out
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.error,
              side: const BorderSide(color: AppColors.error),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            icon: const Icon(Icons.logout),
            label: const Text('Sign Out'),
            onPressed: () => _confirmSignOut(context, ref),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Future<void> _confirmSignOut(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => ctx.pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            onPressed: () => ctx.pop(true),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(secureStorageProvider).clearAll();
      if (context.mounted) {
        context.go(Routes.welcome);
      }
    }
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Widget? trailing;

  const _ProfileTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title, style: AppTextStyles.bodyMedium),
      subtitle: Text(
        subtitle,
        style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
      ),
      trailing: trailing,
    );
  }
}
