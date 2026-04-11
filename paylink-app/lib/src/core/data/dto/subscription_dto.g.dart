// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SubscriptionDtoImpl _$$SubscriptionDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$SubscriptionDtoImpl(
      id: json['id'] as String,
      linkId: json['linkId'] as String,
      linkTitle: json['linkTitle'] as String,
      status: json['status'] as String,
      amount: json['amount'] as String,
      currency: json['currency'] as String,
      cycle: json['cycle'] as String,
      nextRunAt: json['nextRunAt'] as String,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$SubscriptionDtoImplToJson(
        _$SubscriptionDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'linkId': instance.linkId,
      'linkTitle': instance.linkTitle,
      'status': instance.status,
      'amount': instance.amount,
      'currency': instance.currency,
      'cycle': instance.cycle,
      'nextRunAt': instance.nextRunAt,
      'createdAt': instance.createdAt,
    };

_$PagedMetaDtoImpl _$$PagedMetaDtoImplFromJson(Map<String, dynamic> json) =>
    _$PagedMetaDtoImpl(
      page: (json['page'] as num).toInt(),
      limit: (json['limit'] as num).toInt(),
      total: (json['total'] as num).toInt(),
      totalPages: (json['totalPages'] as num).toInt(),
    );

Map<String, dynamic> _$$PagedMetaDtoImplToJson(_$PagedMetaDtoImpl instance) =>
    <String, dynamic>{
      'page': instance.page,
      'limit': instance.limit,
      'total': instance.total,
      'totalPages': instance.totalPages,
    };

_$PagedResponseDtoImpl<T> _$$PagedResponseDtoImplFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    _$PagedResponseDtoImpl<T>(
      items: (json['data'] as List<dynamic>).map(fromJsonT).toList(),
      meta: PagedMetaDto.fromJson(json['meta'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$PagedResponseDtoImplToJson<T>(
  _$PagedResponseDtoImpl<T> instance,
  Object? Function(T value) toJsonT,
) =>
    <String, dynamic>{
      'data': instance.items.map(toJsonT).toList(),
      'meta': instance.meta,
    };
