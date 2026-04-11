import 'package:freezed_annotation/freezed_annotation.dart';
part 'subscription_dto.freezed.dart';
part 'subscription_dto.g.dart';

@freezed
class SubscriptionDto with _$SubscriptionDto {
  const factory SubscriptionDto({
    required String id,
    required String linkId,
    required String linkTitle,
    required String status,
    required String amount,
    required String currency,
    required String cycle,
    required String nextRunAt,
    required String createdAt,
  }) = _SubscriptionDto;
  factory SubscriptionDto.fromJson(Map<String, dynamic> json) =>
      _$SubscriptionDtoFromJson(json);
}

@freezed
class PagedMetaDto with _$PagedMetaDto {
  const factory PagedMetaDto({
    required int page,
    required int limit,
    required int total,
    required int totalPages,
  }) = _PagedMetaDto;
  factory PagedMetaDto.fromJson(Map<String, dynamic> json) =>
      _$PagedMetaDtoFromJson(json);
}

@Freezed(genericArgumentFactories: true)
class PagedResponseDto<T> with _$PagedResponseDto<T> {
  const PagedResponseDto._();

  const factory PagedResponseDto({
    @JsonKey(name: 'data') required List<T> items,
    required PagedMetaDto meta,
  }) = _PagedResponseDto<T>;

  factory PagedResponseDto.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) =>
      _$PagedResponseDtoFromJson(json, fromJsonT);

  bool get hasMore => meta.page < meta.totalPages;
  int get total => meta.total;
  int get page => meta.page;
  int get limit => meta.limit;
}
