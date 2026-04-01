import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:go_router/go_router.dart';
import '../data/storage/secure_storage_service.dart';

class FcmService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final SecureStorageService _storage;
  GoRouter? _router;

  FcmService(this._storage);

  void setRouter(GoRouter router) {
    _router = router;
  }

  Future<void> initialize() async {
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    final token = await _messaging.getToken();
    if (token != null) {
      await _storage.saveFcmToken(token);
    }

    _messaging.onTokenRefresh.listen((newToken) {
      _storage.saveFcmToken(newToken);
    });

    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    // Riverpod providers in features will watch the notification stream
  }

  void _handleMessageOpenedApp(RemoteMessage message) {
    final data = message.data;
    final router = _router;
    if (router == null) return;
    if (data['type'] == 'payment') {
      router.push('/merchant/transactions/${data['transactionId']}');
    } else if (data['type'] == 'payment_request') {
      router.push('/payer/pay/${data['slug']}');
    }
  }

  Future<String?> getToken() => _messaging.getToken();
}
