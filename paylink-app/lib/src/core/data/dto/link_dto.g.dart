// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'link_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PaymentLinkDtoImpl _$$PaymentLinkDtoImplFromJson(Map<String, dynamic> json) =>
    _$PaymentLinkDtoImpl(
      id: json['id'] as String,
      slug: json['slug'] as String,
      title: json['title'] as String,
      type: json['type'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      status: json['status'] as String,
      createdAt: json['createdAt'] as String,
      useCount: (json['useCount'] as num?)?.toInt(),
      maxUses: (json['maxUses'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$PaymentLinkDtoImplToJson(
        _$PaymentLinkDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'slug': instance.slug,
      'title': instance.title,
      'type': instance.type,
      'amount': instance.amount,
      'currency': instance.currency,
      'status': instance.status,
      'createdAt': instance.createdAt,
      'useCount': instance.useCount,
      'maxUses': instance.maxUses,
    };

_$CreateLinkRequestDtoImpl _$$CreateLinkRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$CreateLinkRequestDtoImpl(
      title: json['title'] as String,
      type: json['type'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      description: json['description'] as String?,
      maxUses: (json['maxUses'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$CreateLinkRequestDtoImplToJson(
        _$CreateLinkRequestDtoImpl instance) =>
    <String, dynamic>{
      'title': instance.title,
      'type': instance.type,
      'amount': instance.amount,
      'currency': instance.currency,
      'description': instance.description,
      'maxUses': instance.maxUses,
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
      title: json['title'] as String,
      type: json['type'] as String,
      amount: json['amount'] as String?,
      currency: json['currency'] as String,
      status: json['status'] as String,
      createdAt: json['createdAt'] as String,
      useCount: (json['useCount'] as num?)?.toInt(),
      maxUses: (json['maxUses'] as num?)?.toInt(),
      description: json['description'] as String?,
      deepLink: json['deepLink'] as String?,
    );

Map<String, dynamic> _$$LinkDetailDtoImplToJson(_$LinkDetailDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'slug': instance.slug,
      'title': instance.title,
      'type': instance.type,
      'amount': instance.amount,
      'currency': instance.currency,
      'status': instance.status,
      'createdAt': instance.createdAt,
      'useCount': instance.useCount,
      'maxUses': instance.maxUses,
      'description': instance.description,
      'deepLink': instance.deepLink,
    };
