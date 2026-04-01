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

@Freezed(genericArgumentFactories: true)
class PagedResponseDto<T> with _$PagedResponseDto<T> {
  const factory PagedResponseDto({
    required List<T> items,
    required int total,
    required int page,
    required int limit,
    required bool hasMore,
  }) = _PagedResponseDto<T>;
  factory PagedResponseDto.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) =>
      _$PagedResponseDtoFromJson(json, fromJsonT);
}
