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

_$PagedResponseDtoImpl<T> _$$PagedResponseDtoImplFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    _$PagedResponseDtoImpl<T>(
      items: (json['items'] as List<dynamic>).map(fromJsonT).toList(),
      total: (json['total'] as num).toInt(),
      page: (json['page'] as num).toInt(),
      limit: (json['limit'] as num).toInt(),
      hasMore: json['hasMore'] as bool,
    );

Map<String, dynamic> _$$PagedResponseDtoImplToJson<T>(
  _$PagedResponseDtoImpl<T> instance,
  Object? Function(T value) toJsonT,
) =>
    <String, dynamic>{
      'items': instance.items.map(toJsonT).toList(),
      'total': instance.total,
      'page': instance.page,
      'limit': instance.limit,
      'hasMore': instance.hasMore,
    };
