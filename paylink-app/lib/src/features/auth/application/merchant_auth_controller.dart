import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/auth_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'merchant_auth_controller.g.dart';

@riverpod
class MerchantAuthController extends _$MerchantAuthController {
  @override
  AsyncValue<void> build() => const AsyncData(null);

  Future<bool> login({required String email, required String password}) async {
    state = const AsyncLoading();
    final api = ref.read(paylinkApiProvider);
    final storage = ref.read(secureStorageProvider);
    state = await AsyncValue.guard(() async {
      final res = await api.merchantLogin(
        MerchantLoginRequestDto(email: email, password: password),
      );
      await storage.saveMerchantSession(
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        merchantId: res.merchantId,
      );
    });
    return state is AsyncData;
  }

  Future<bool> register({
    required String businessName,
    required String email,
    required String password,
    required String msisdn,
  }) async {
    state = const AsyncLoading();
    final api = ref.read(paylinkApiProvider);
    final storage = ref.read(secureStorageProvider);
    state = await AsyncValue.guard(() async {
      final res = await api.merchantRegister(
        MerchantRegisterRequestDto(
          businessName: businessName,
          email: email,
          password: password,
          msisdn: msisdn,
        ),
      );
      await storage.saveMerchantSession(
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        merchantId: res.merchantId,
      );
    });
    return state is AsyncData;
  }
}
