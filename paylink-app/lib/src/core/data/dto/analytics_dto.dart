import 'package:freezed_annotation/freezed_annotation.dart';
part 'analytics_dto.freezed.dart';
part 'analytics_dto.g.dart';

@freezed
class AnalyticsSummaryDto with _$AnalyticsSummaryDto {
  const factory AnalyticsSummaryDto({
    required String totalVolume,
    required int totalCount,
    required String successVolume,
    required int successCount,
    required int failCount,
    required String currency,
    required List<DailyVolumeDto> dailySeries,
  }) = _AnalyticsSummaryDto;
  factory AnalyticsSummaryDto.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsSummaryDtoFromJson(json);
}

@freezed
class DailyVolumeDto with _$DailyVolumeDto {
  const factory DailyVolumeDto({
    required String date,
    required String volume,
    required int count,
  }) = _DailyVolumeDto;
  factory DailyVolumeDto.fromJson(Map<String, dynamic> json) =>
      _$DailyVolumeDtoFromJson(json);
}
