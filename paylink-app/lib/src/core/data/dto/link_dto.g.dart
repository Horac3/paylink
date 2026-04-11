// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'link_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PaymentLinkDtoImpl _$$PaymentLinkDtoImplFromJson(Map<String, dynamic> json) =>
    _$PaymentLinkDtoImpl(
      id: json['id'] as String,
      slug: json['slug'] as String,
      type: json['type'] as String,
      status: json['status'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      description: json['description'] as String?,
      expiresAt: json['expiresAt'] as String?,
      createdAt: json['createdAt'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$$PaymentLinkDtoImplToJson(
        _$PaymentLinkDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'slug': instance.slug,
      'type': instance.type,
      'status': instance.status,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'expiresAt': instance.expiresAt,
      'createdAt': instance.createdAt,
      'metadata': instance.metadata,
    };

_$CreateLinkRequestDtoImpl _$$CreateLinkRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$CreateLinkRequestDtoImpl(
      type: json['type'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      description: json['description'] as String?,
      expiresAt: json['expiresAt'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      recipientMsisdn: json['recipientMsisdn'] as String?,
      providerCode: json['providerCode'] as String?,
      recurrenceInterval: json['recurrenceInterval'] as String?,
      maxCycles: (json['maxCycles'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$CreateLinkRequestDtoImplToJson(
        _$CreateLinkRequestDtoImpl instance) =>
    <String, dynamic>{
      'type': instance.type,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'expiresAt': instance.expiresAt,
      'metadata': instance.metadata,
      'recipientMsisdn': instance.recipientMsisdn,
      'providerCode': instance.providerCode,
      'recurrenceInterval': instance.recurrenceInterval,
      'maxCycles': instance.maxCycles,
    };

_$BulkSendRequestDtoImpl _$$BulkSendRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$BulkSendRequestDtoImpl(
      linkId: json['linkId'] as String,
      msisdns:
          (json['msisdns'] as List<dynamic>).map((e) => e as String).toList(),
    );

Map<String, dynamic> _$$BulkSendRequestDtoImplToJson(
        _$BulkSendRequestDtoImpl instance) =>
    <String, dynamic>{
      'linkId': instance.linkId,
      'msisdns': instance.msisdns,
    };

_$LinkDetailDtoImpl _$$LinkDetailDtoImplFromJson(Map<String, dynamic> json) =>
    _$LinkDetailDtoImpl(
      id: json['id'] as String,
      slug: json['slug'] as String,
      type: json['type'] as String,
      status: json['status'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      description: json['description'] as String?,
      expiresAt: json['expiresAt'] as String?,
      createdAt: json['createdAt'] as String?,
      qrCodeBase64: json['qrCodeBase64'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$$LinkDetailDtoImplToJson(_$LinkDetailDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'slug': instance.slug,
      'type': instance.type,
      'status': instance.status,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'expiresAt': instance.expiresAt,
      'createdAt': instance.createdAt,
      'qrCodeBase64': instance.qrCodeBase64,
      'metadata': instance.metadata,
    };
