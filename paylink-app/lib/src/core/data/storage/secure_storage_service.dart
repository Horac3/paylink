import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../domain/storage_keys.dart';
import '../../domain/user_role.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  Future<void> saveMerchantSession({
    required String accessToken,
    required String refreshToken,
    required String merchantId,
  }) async {
    await Future.wait([
      _storage.write(key: StorageKeys.authToken, value: accessToken),
      _storage.write(key: StorageKeys.refreshToken, value: refreshToken),
      _storage.write(key: StorageKeys.merchantId, value: merchantId),
      _storage.write(key: StorageKeys.userRole, value: UserRole.merchant.name),
    ]);
  }

  Future<void> savePayerSession({
    required String payerSessionToken,
    required String msisdnHint,
  }) async {
    await Future.wait([
      _storage.write(
          key: StorageKeys.payerSessionToken, value: payerSessionToken),
      _storage.write(key: StorageKeys.msisdnHint, value: msisdnHint),
      _storage.write(key: StorageKeys.userRole, value: UserRole.payer.name),
    ]);
  }

  Future<String?> getAuthToken() =>
      _storage.read(key: StorageKeys.authToken);

  Future<String?> getPayerSessionToken() =>
      _storage.read(key: StorageKeys.payerSessionToken);

  Future<String?> getMsisdnHint() =>
      _storage.read(key: StorageKeys.msisdnHint);

  Future<String?> getMerchantId() =>
      _storage.read(key: StorageKeys.merchantId);

  Future<UserRole?> getUserRole() async {
    final raw = await _storage.read(key: StorageKeys.userRole);
    if (raw == null) return null;
    return UserRole.values.firstWhere(
      (r) => r.name == raw,
      orElse: () => UserRole.payer,
    );
  }

  Future<bool> isAuthenticated() async {
    final role = await getUserRole();
    if (role == null) return false;
    if (role == UserRole.merchant) {
      return (await getAuthToken()) != null;
    }
    return (await getPayerSessionToken()) != null;
  }

  Future<void> saveFcmToken(String token) =>
      _storage.write(key: StorageKeys.fcmToken, value: token);

  Future<String?> getFcmToken() =>
      _storage.read(key: StorageKeys.fcmToken);

  Future<void> clearAll() => _storage.deleteAll();
}
