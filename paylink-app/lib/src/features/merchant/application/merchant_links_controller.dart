import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/link_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'merchant_links_controller.g.dart';

@riverpod
class MerchantLinksController extends _$MerchantLinksController {
  static const _limit = 20;
  int _page = 1;
  bool _hasMore = true;

  @override
  Future<List<PaymentLinkDto>> build() async {
    _page = 1;
    _hasMore = true;
    final api = ref.read(paylinkApiProvider);
    final res = await api.getLinks(_page, _limit);
    _hasMore = res.hasMore;
    return res.items;
  }

  Future<void> createLink(CreateLinkRequestDto dto) async {
    final api = ref.read(paylinkApiProvider);
    final created = await api.createLink(dto);
    final current = await future;
    state = AsyncData([created, ...current]);
  }

  Future<void> archiveLink(String id) async {
    final api = ref.read(paylinkApiProvider);
    await api.archiveLink(id);
    final current = await future;
    state = AsyncData(current.where((l) => l.id != id).toList());
  }

  Future<void> loadMore() async {
    if (!_hasMore) return;
    final current = await future;
    _page++;
    final api = ref.read(paylinkApiProvider);
    final res = await api.getLinks(_page, _limit);
    _hasMore = res.hasMore;
    state = AsyncData([...current, ...res.items]);
  }

  bool get hasMore => _hasMore;
}
