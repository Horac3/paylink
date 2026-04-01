import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';
import '../api/paylink_api.dart';
import '../storage/secure_storage_service.dart';
import '../../application/biometric_service.dart';
import '../../application/deep_link_service.dart';
import '../../application/fcm_service.dart';
import '../../presentation/navigation/router.dart';
import '../../security/root_detection_service.dart';

// Secure Storage
final secureStorageProvider =
    Provider<SecureStorageService>((_) => SecureStorageService());

// Dio + API
final dioProvider = Provider((_) => createDio());
final paylinkApiProvider =
    Provider((ref) => PaylinkApi(ref.read(dioProvider)));

// Services
final biometricServiceProvider = Provider((_) => BiometricService());
final fcmServiceProvider =
    Provider((ref) => FcmService(ref.read(secureStorageProvider)));
final deepLinkServiceProvider = Provider<DeepLinkService>((ref) {
  final router = ref.read(routerProvider);
  return DeepLinkService(router);
});

// Security
final rootDetectionServiceProvider =
    Provider<RootDetectionService>((_) => RootDetectionService());

// Connectivity — streams true if online
final connectivityProvider = StreamProvider<bool>((ref) {
  return Connectivity().onConnectivityChanged.map(
        (results) => results.any((r) => r != ConnectivityResult.none),
      );
});
