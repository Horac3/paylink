import 'package:app_links/app_links.dart';
import 'package:go_router/go_router.dart';

class DeepLinkService {
  final GoRouter _router;
  final AppLinks _appLinks = AppLinks();

  DeepLinkService(this._router);

  Future<void> initialize() async {
    // Handle cold-start deep link
    final initialUri = await _appLinks.getInitialLink();
    if (initialUri != null) {
      _handleUri(initialUri);
    }

    // Handle deep links while running
    _appLinks.uriLinkStream.listen(_handleUri);
  }

  void _handleUri(Uri uri) {
    // paylink://pay/SLUG  or  https://paylink.never9to5ive.com/pay/SLUG
    final pathSegments = uri.pathSegments;
    if (pathSegments.length >= 2 &&
        pathSegments[pathSegments.length - 2] == 'pay') {
      final slug = pathSegments.last;
      _router.push('/payer/pay/$slug');
    }
  }
}
