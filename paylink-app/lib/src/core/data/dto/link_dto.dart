import 'package:freezed_annotation/freezed_annotation.dart';
part 'link_dto.freezed.dart';
part 'link_dto.g.dart';

@freezed
class PaymentLinkDto with _$PaymentLinkDto {
  const factory PaymentLinkDto({
    required String id,
    required String slug,
    required String type,
    required String status,
    String? amount,
    required String currency,
    String? description,
    String? expiresAt,
    String? createdAt,
    Map<String, dynamic>? metadata,
  }) = _PaymentLinkDto;
  factory PaymentLinkDto.fromJson(Map<String, dynamic> json) =>
      _$PaymentLinkDtoFromJson(json);
}

@freezed
class CreateLinkRequestDto with _$CreateLinkRequestDto {
  const factory CreateLinkRequestDto({
    required String type,
    String? amount,
    required String currency,
    String? description,
    String? expiresAt,
    Map<String, dynamic>? metadata,
    String? recipientMsisdn,
    String? providerCode,
    String? recurrenceInterval,
    int? maxCycles,
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
    required String type,
    required String status,
    String? amount,
    required String currency,
    String? description,
    String? expiresAt,
    String? createdAt,
    String? qrCodeBase64,
    Map<String, dynamic>? metadata,
  }) = _LinkDetailDto;
  factory LinkDetailDto.fromJson(Map<String, dynamic> json) =>
      _$LinkDetailDtoFromJson(json);
}
