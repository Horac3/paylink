import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../domain/storage_keys.dart';
import '../../security/certificate_pinner.dart';

Dio createDio() {
  final baseUrl = dotenv.env['API_BASE_URL'] ?? 'https://api.paylink.never9to5ive.com/api/v1';
  final dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {'Content-Type': 'application/json'},
  ));
  // Apply certificate pinning before adding interceptors (release mode only).
  applyCertificatePinning(dio);
  dio.interceptors.add(AuthInterceptor(dio));
  dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
  return dio;
}

class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final _storage = const FlutterSecureStorage();
  bool _isRefreshing = false;

  AuthInterceptor(this._dio);

  @override
  Future<void> onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: StorageKeys.authToken) ??
        await _storage.read(key: StorageKeys.payerSessionToken);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
      DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && !_isRefreshing) {
      _isRefreshing = true;
      try {
        final refreshToken =
            await _storage.read(key: StorageKeys.refreshToken);
        if (refreshToken != null) {
          final response = await _dio
              .post('/auth/refresh', data: {'refreshToken': refreshToken});
          final newToken = response.data['accessToken'] as String;
          await _storage.write(key: StorageKeys.authToken, value: newToken);
          err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
          final retryResponse = await _dio.fetch(err.requestOptions);
          handler.resolve(retryResponse);
          return;
        }
      } catch (_) {
        await _storage.deleteAll();
      } finally {
        _isRefreshing = false;
      }
    }
    handler.next(err);
  }
}
