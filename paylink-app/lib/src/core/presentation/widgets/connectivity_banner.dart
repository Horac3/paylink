import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/providers/core_providers.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class ConnectivityBanner extends ConsumerWidget {
  final Widget child;
  const ConnectivityBanner({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final connectivityAsync = ref.watch(connectivityProvider);
    final isOnline = connectivityAsync.valueOrNull ?? true;
    return Column(
      children: [
        if (!isOnline)
          Container(
            width: double.infinity,
            color: AppColors.warning,
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
            child: Text(
              'No internet connection — showing cached data',
              style: AppTextStyles.bodySmall.copyWith(color: Colors.white),
              textAlign: TextAlign.center,
            ),
          ),
        Expanded(child: child),
      ],
    );
  }
}
