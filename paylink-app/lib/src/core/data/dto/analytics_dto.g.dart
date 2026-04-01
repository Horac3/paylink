// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AnalyticsSummaryDtoImpl _$$AnalyticsSummaryDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$AnalyticsSummaryDtoImpl(
      totalVolume: json['totalVolume'] as String,
      totalCount: (json['totalCount'] as num).toInt(),
      successVolume: json['successVolume'] as String,
      successCount: (json['successCount'] as num).toInt(),
      failCount: (json['failCount'] as num).toInt(),
      currency: json['currency'] as String,
      dailySeries: (json['dailySeries'] as List<dynamic>)
          .map((e) => DailyVolumeDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$AnalyticsSummaryDtoImplToJson(
        _$AnalyticsSummaryDtoImpl instance) =>
    <String, dynamic>{
      'totalVolume': instance.totalVolume,
      'totalCount': instance.totalCount,
      'successVolume': instance.successVolume,
      'successCount': instance.successCount,
      'failCount': instance.failCount,
      'currency': instance.currency,
      'dailySeries': instance.dailySeries,
    };

_$DailyVolumeDtoImpl _$$DailyVolumeDtoImplFromJson(Map<String, dynamic> json) =>
    _$DailyVolumeDtoImpl(
      date: json['date'] as String,
      volume: json['volume'] as String,
      count: (json['count'] as num).toInt(),
    );

Map<String, dynamic> _$$DailyVolumeDtoImplToJson(
        _$DailyVolumeDtoImpl instance) =>
    <String, dynamic>{
      'date': instance.date,
      'volume': instance.volume,
      'count': instance.count,
    };
