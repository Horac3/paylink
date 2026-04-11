import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/navigation/routes.dart';

class PayerQrScannerPage extends StatefulWidget {
  const PayerQrScannerPage({super.key});

  @override
  State<PayerQrScannerPage> createState() => _PayerQrScannerPageState();
}

class _PayerQrScannerPageState extends State<PayerQrScannerPage> {
  final MobileScannerController _controller = MobileScannerController();
  bool _scanned = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleBarcode(BarcodeCapture capture) {
    if (_scanned) return;
    final barcode = capture.barcodes.firstOrNull;
    if (barcode == null) return;
    final raw = barcode.rawValue;
    if (raw == null || raw.isEmpty) return;

    _scanned = true;
    _controller.stop();

    // Extract slug (and optional ?r= recipient token) from a paylink URL
    final (slug, recipientToken) = _extractSlugAndToken(raw);
    if (!mounted) return;

    var path = Routes.payerPaymentConfirm.replaceFirst(':slug', slug);
    if (recipientToken != null) path = '$path?r=${Uri.encodeComponent(recipientToken)}';
    context.pushReplacement(path);
  }

  /// Returns (slug, recipientToken?) from a scanned value.
  /// Handles full URLs like https://pay.paylink.mw/payer/pay/<slug>?r=TOKEN
  /// or bare slugs.
  (String, String?) _extractSlugAndToken(String raw) {
    try {
      final uri = Uri.parse(raw);
      final segments = uri.pathSegments;
      if (segments.length >= 3 &&
          segments[0] == 'payer' &&
          segments[1] == 'pay') {
        final slug = segments[2];
        final token = uri.queryParameters['r'];
        return (slug, token);
      }
    } catch (_) {}
    // Fallback: treat entire value as slug, no token
    return (raw, null);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on),
            tooltip: 'Toggle torch',
            onPressed: _controller.toggleTorch,
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: Stack(
              alignment: Alignment.center,
              children: [
                MobileScanner(
                  controller: _controller,
                  onDetect: _handleBarcode,
                ),
                // Viewfinder overlay
                Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: AppColors.primary,
                      width: 3,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.qr_code_scanner,
                    size: 36,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Point your camera at a PayLink QR code',
                    style: AppTextStyles.bodyMedium
                        .copyWith(color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
