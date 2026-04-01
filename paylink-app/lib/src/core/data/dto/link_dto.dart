import 'package:freezed_annotation/freezed_annotation.dart';
part 'link_dto.freezed.dart';
part 'link_dto.g.dart';

@freezed
class PaymentLinkDto with _$PaymentLinkDto {
  const factory PaymentLinkDto({
    required String id,
    required String slug,
    required String title,
    required String type,
    String? amount,
    required String currency,
    required String status,
    required String createdAt,
    int? useCount,
    int? maxUses,
  }) = _PaymentLinkDto;
  factory PaymentLinkDto.fromJson(Map<String, dynamic> json) =>
      _$PaymentLinkDtoFromJson(json);
}

@freezed
class CreateLinkRequestDto with _$CreateLinkRequestDto {
  const factory CreateLinkRequestDto({
    required String title,
    required String type,
    String? amount,
    required String currency,
    String? description,
    int? maxUses,
  }) = _CreateLinkRequestDto;
  factory CreateLinkRequestDto.fromJson(Map<String, dynamic> json) =>
      _$CreateLinkRequestDtoFromJson(json);
}

@freezed
class BulkSendRequestDto with _$BulkSendRequestDto {
  const factory BulkSendRequestDto({
    required String linkId,
    required List<String> msisdns,
  }) = _BulkSendRequestDto;
  factory BulkSendRequestDto.fromJson(Map<String, dynamic> json) =>
      _$BulkSendRequestDtoFromJson(json);
}

@freezed
class LinkDetailDto with _$LinkDetailDto {
  const factory LinkDetailDto({
    required String id,
    required String slug,
    required String title,
    required String type,
    String? amount,
    required String currency,
    required String status,
    required String createdAt,
    int? useCount,
    int? maxUses,
    String? description,
    String? deepLink,
  }) = _LinkDetailDto;
  factory LinkDetailDto.fromJson(Map<String, dynamic> json) =>
      _$LinkDetailDtoFromJson(json);
}
