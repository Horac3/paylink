import 'package:freezed_annotation/freezed_annotation.dart';
part 'transaction_dto.freezed.dart';
part 'transaction_dto.g.dart';

@freezed
class TransactionDto with _$TransactionDto {
  const factory TransactionDto({
    required String id,
    required String status,
    required String amount,
    required String currency,
    required String msisdnHint,
    required String createdAt,
    String? failureReason,
    String? linkId,
    String? linkTitle,
  }) = _TransactionDto;
  factory TransactionDto.fromJson(Map<String, dynamic> json) =>
      _$TransactionDtoFromJson(json);
}

@freezed
class InitiatePaymentRequestDto with _$InitiatePaymentRequestDto {
  const factory InitiatePaymentRequestDto({
    // Strategy A — registered payer session
    String? payerSessionToken,
    // Strategy B — pre-filled recipient token
    String? recipientToken,
    // Strategy C — guest MSISDN
    String? msisdn,
    String? providerCode,
  }) = _InitiatePaymentRequestDto;
  factory InitiatePaymentRequestDto.fromJson(Map<String, dynamic> json) =>
      _$InitiatePaymentRequestDtoFromJson(json);
}

@freezed
class PaymentStatusDto with _$PaymentStatusDto {
  const factory PaymentStatusDto({
    required String transactionId,
    required String status,
    String? externalRef,
  }) = _PaymentStatusDto;
  factory PaymentStatusDto.fromJson(Map<String, dynamic> json) =>
      _$PaymentStatusDtoFromJson(json);
}

@freezed
class InitiatePaymentResponseDto with _$InitiatePaymentResponseDto {
  const factory InitiatePaymentResponseDto({
    required String transactionId,
    required String status,
    String? depositId,
  }) = _InitiatePaymentResponseDto;
  factory InitiatePaymentResponseDto.fromJson(Map<String, dynamic> json) =>
      _$InitiatePaymentResponseDtoFromJson(json);
}

@freezed
class RefundRequestDto with _$RefundRequestDto {
  const factory RefundRequestDto({
    required String transactionId,
    required String reason,
  }) = _RefundRequestDto;
  factory RefundRequestDto.fromJson(Map<String, dynamic> json) =>
      _$RefundRequestDtoFromJson(json);
}
