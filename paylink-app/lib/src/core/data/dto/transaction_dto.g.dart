// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TransactionDtoImpl _$$TransactionDtoImplFromJson(Map<String, dynamic> json) =>
    _$TransactionDtoImpl(
      id: json['id'] as String,
      status: json['status'] as String,
      amount: json['amount'] as String,
      currency: json['currency'] as String,
      msisdnHint: json['msisdnHint'] as String,
      createdAt: json['createdAt'] as String,
      failureReason: json['failureReason'] as String?,
      linkId: json['linkId'] as String?,
      linkTitle: json['linkTitle'] as String?,
    );

Map<String, dynamic> _$$TransactionDtoImplToJson(
        _$TransactionDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'status': instance.status,
      'amount': instance.amount,
      'currency': instance.currency,
      'msisdnHint': instance.msisdnHint,
      'createdAt': instance.createdAt,
      'failureReason': instance.failureReason,
      'linkId': instance.linkId,
      'linkTitle': instance.linkTitle,
    };

_$InitiatePaymentRequestDtoImpl _$$InitiatePaymentRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$InitiatePaymentRequestDtoImpl(
      payerSessionToken: json['payerSessionToken'] as String?,
      recipientToken: json['recipientToken'] as String?,
      msisdn: json['msisdn'] as String?,
      providerCode: json['providerCode'] as String?,
    );

Map<String, dynamic> _$$InitiatePaymentRequestDtoImplToJson(
        _$InitiatePaymentRequestDtoImpl instance) =>
    <String, dynamic>{
      'payerSessionToken': instance.payerSessionToken,
      'recipientToken': instance.recipientToken,
      'msisdn': instance.msisdn,
      'providerCode': instance.providerCode,
    };

_$PaymentStatusDtoImpl _$$PaymentStatusDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$PaymentStatusDtoImpl(
      transactionId: json['transactionId'] as String,
      status: json['status'] as String,
      externalRef: json['externalRef'] as String?,
    );

Map<String, dynamic> _$$PaymentStatusDtoImplToJson(
        _$PaymentStatusDtoImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'status': instance.status,
      'externalRef': instance.externalRef,
    };

_$InitiatePaymentResponseDtoImpl _$$InitiatePaymentResponseDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$InitiatePaymentResponseDtoImpl(
      transactionId: json['transactionId'] as String,
      status: json['status'] as String,
      depositId: json['depositId'] as String?,
    );

Map<String, dynamic> _$$InitiatePaymentResponseDtoImplToJson(
        _$InitiatePaymentResponseDtoImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'status': instance.status,
      'depositId': instance.depositId,
    };

_$RefundRequestDtoImpl _$$RefundRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$RefundRequestDtoImpl(
      transactionId: json['transactionId'] as String,
      reason: json['reason'] as String,
    );

Map<String, dynamic> _$$RefundRequestDtoImplToJson(
        _$RefundRequestDtoImpl instance) =>
    <String, dynamic>{
      'transactionId': instance.transactionId,
      'reason': instance.reason,
    };
