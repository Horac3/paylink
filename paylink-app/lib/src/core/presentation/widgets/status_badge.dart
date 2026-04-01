import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

enum BadgeStatus { success, pending, failed, cancelled, processing }

class StatusBadge extends StatelessWidget {
  final String label;
  final BadgeStatus status;

  const StatusBadge({super.key, required this.label, required this.status});

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (status) {
      BadgeStatus.success => (AppColors.success.withValues(alpha: 0.12), AppColors.success),
      BadgeStatus.pending => (AppColors.warning.withValues(alpha: 0.12), AppColors.warning),
      BadgeStatus.processing => (AppColors.secondary.withValues(alpha: 0.12), AppColors.secondary),
      BadgeStatus.failed => (AppColors.error.withValues(alpha: 0.12), AppColors.error),
      BadgeStatus.cancelled => (AppColors.textSecondary.withValues(alpha: 0.12), AppColors.textSecondary),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Text(label, style: AppTextStyles.labelMedium.copyWith(color: fg)),
    );
  }
}
