import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/transaction_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'merchant_refund_controller.g.dart';

@riverpod
class MerchantRefundController extends _$MerchantRefundController {
  @override
  AsyncValue<void> build() => const AsyncData(null);

  Future<bool> requestRefund({
    required String transactionId,
    required String reason,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(paylinkApiProvider).requestRefund(
            RefundRequestDto(transactionId: transactionId, reason: reason),
          );
    });
    return state is AsyncData;
  }
}
