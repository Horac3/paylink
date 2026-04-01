import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

enum MoneySize { large, medium, small }

class MoneyText extends StatelessWidget {
  final String amount;
  final String currency;
  final MoneySize size;
  final Color? color;

  const MoneyText({
    super.key,
    required this.amount,
    this.currency = 'MWK',
    this.size = MoneySize.medium,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final style = switch (size) {
      MoneySize.large => AppTextStyles.moneyLarge,
      MoneySize.medium => AppTextStyles.moneyMedium,
      MoneySize.small => AppTextStyles.titleMedium.copyWith(color: AppColors.primary),
    };
    return RichText(
      text: TextSpan(
        children: [
          TextSpan(
            text: '$currency ',
            style: style.copyWith(
              fontSize: style.fontSize! * 0.6,
              color: color ?? AppColors.textSecondary,
            ),
          ),
          TextSpan(
            text: _formatAmount(amount),
            style: style.copyWith(color: color ?? AppColors.primary),
          ),
        ],
      ),
    );
  }

  String _formatAmount(String raw) {
    final parts = raw.split('.');
    final intPart = parts[0].replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]},',
    );
    return parts.length > 1 ? '$intPart.${parts[1].padRight(2, '0').substring(0, 2)}' : '$intPart.00';
  }
}
