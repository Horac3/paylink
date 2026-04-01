import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/transaction_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'merchant_transactions_controller.g.dart';

typedef TransactionState = ({
  List<TransactionDto> items,
  bool hasMore,
  int page,
});

@riverpod
class MerchantTransactionsController
    extends _$MerchantTransactionsController {
  static const _limit = 20;

  @override
  Future<TransactionState> build() async {
    final api = ref.read(paylinkApiProvider);
    final res = await api.getTransactions(1, _limit, null);
    return (
      items: res.items,
      hasMore: res.hasMore,
      page: 1,
    );
  }

  Future<void> loadMore() async {
    final current = await future;
    if (!current.hasMore) return;
    final nextPage = current.page + 1;
    final api = ref.read(paylinkApiProvider);
    final res = await api.getTransactions(nextPage, _limit, null);
    state = AsyncData((
      items: [...current.items, ...res.items],
      hasMore: res.hasMore,
      page: nextPage,
    ));
  }
}
