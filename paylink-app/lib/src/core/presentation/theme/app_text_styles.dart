import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._();
  static const _base = TextStyle(fontFamily: 'Inter', color: AppColors.textPrimary);
  static final displayLarge = _base.copyWith(fontSize: 32, fontWeight: FontWeight.w700);
  static final headlineLarge = _base.copyWith(fontSize: 24, fontWeight: FontWeight.w700);
  static final headlineMedium = _base.copyWith(fontSize: 20, fontWeight: FontWeight.w600);
  static final titleLarge = _base.copyWith(fontSize: 18, fontWeight: FontWeight.w600);
  static final titleMedium = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w500);
  static final bodyLarge = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w400);
  static final bodyMedium = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w400);
  static final bodySmall = _base.copyWith(fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textSecondary);
  static final labelLarge = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w600);
  static final labelMedium = _base.copyWith(fontSize: 12, fontWeight: FontWeight.w500);
  static final moneyLarge = _base.copyWith(fontSize: 36, fontWeight: FontWeight.w700, color: AppColors.primary);
  static final moneyMedium = _base.copyWith(fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.primary);
}
