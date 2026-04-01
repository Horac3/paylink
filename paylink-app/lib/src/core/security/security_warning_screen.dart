import 'package:flutter/material.dart';
import '../presentation/theme/app_colors.dart';
import '../presentation/theme/app_text_styles.dart';

/// Shown when the device is rooted or jailbroken.
///
/// The app is fully blocked at this point — there is no way to dismiss
/// this screen. The user must run PayLink on an uncompromised device to
/// protect their financial data.
class SecurityWarningScreen extends StatelessWidget {
  const SecurityWarningScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.error,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.security, size: 80, color: Colors.white),
              const SizedBox(height: 24),
              Text(
                'Security Warning',
                style: AppTextStyles.headlineLarge.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'This device appears to be rooted or jailbroken. '
                'PayLink cannot run on compromised devices to protect '
                'your financial data.',
                style: AppTextStyles.bodyLarge.copyWith(color: Colors.white70),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
