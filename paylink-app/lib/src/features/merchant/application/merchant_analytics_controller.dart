import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/analytics_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'merchant_analytics_controller.g.dart';

@riverpod
class MerchantAnalyticsController extends _$MerchantAnalyticsController {
  @override
  Future<AnalyticsSummaryDto> build() async {
    final to = DateTime.now();
    final from = to.subtract(const Duration(days: 30));
    return ref.read(paylinkApiProvider).getAnalyticsSummary(
          _fmt(from),
          _fmt(to),
        );
  }

  Future<void> fetchRange(DateTime from, DateTime to) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(paylinkApiProvider).getAnalyticsSummary(
            _fmt(from),
            _fmt(to),
          ),
    );
  }

  String _fmt(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
}
