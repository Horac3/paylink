// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analytics_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

AnalyticsSummaryDto _$AnalyticsSummaryDtoFromJson(Map<String, dynamic> json) {
  return _AnalyticsSummaryDto.fromJson(json);
}

/// @nodoc
mixin _$AnalyticsSummaryDto {
  String get totalVolume => throw _privateConstructorUsedError;
  int get totalCount => throw _privateConstructorUsedError;
  String get successVolume => throw _privateConstructorUsedError;
  int get successCount => throw _privateConstructorUsedError;
  int get failCount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  List<DailyVolumeDto> get dailySeries => throw _privateConstructorUsedError;

  /// Serializes this AnalyticsSummaryDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AnalyticsSummaryDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AnalyticsSummaryDtoCopyWith<AnalyticsSummaryDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyticsSummaryDtoCopyWith<$Res> {
  factory $AnalyticsSummaryDtoCopyWith(
          AnalyticsSummaryDto value, $Res Function(AnalyticsSummaryDto) then) =
      _$AnalyticsSummaryDtoCopyWithImpl<$Res, AnalyticsSummaryDto>;
  @useResult
  $Res call(
      {String totalVolume,
      int totalCount,
      String successVolume,
      int successCount,
      int failCount,
      String currency,
      List<DailyVolumeDto> dailySeries});
}

/// @nodoc
class _$AnalyticsSummaryDtoCopyWithImpl<$Res, $Val extends AnalyticsSummaryDto>
    implements $AnalyticsSummaryDtoCopyWith<$Res> {
  _$AnalyticsSummaryDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AnalyticsSummaryDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalVolume = null,
    Object? totalCount = null,
    Object? successVolume = null,
    Object? successCount = null,
    Object? failCount = null,
    Object? currency = null,
    Object? dailySeries = null,
  }) {
    return _then(_value.copyWith(
      totalVolume: null == totalVolume
          ? _value.totalVolume
          : totalVolume // ignore: cast_nullable_to_non_nullable
              as String,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      successVolume: null == successVolume
          ? _value.successVolume
          : successVolume // ignore: cast_nullable_to_non_nullable
              as String,
      successCount: null == successCount
          ? _value.successCount
          : successCount // ignore: cast_nullable_to_non_nullable
              as int,
      failCount: null == failCount
          ? _value.failCount
          : failCount // ignore: cast_nullable_to_non_nullable
              as int,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      dailySeries: null == dailySeries
          ? _value.dailySeries
          : dailySeries // ignore: cast_nullable_to_non_nullable
              as List<DailyVolumeDto>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AnalyticsSummaryDtoImplCopyWith<$Res>
    implements $AnalyticsSummaryDtoCopyWith<$Res> {
  factory _$$AnalyticsSummaryDtoImplCopyWith(_$AnalyticsSummaryDtoImpl value,
          $Res Function(_$AnalyticsSummaryDtoImpl) then) =
      __$$AnalyticsSummaryDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String totalVolume,
      int totalCount,
      String successVolume,
      int successCount,
      int failCount,
      String currency,
      List<DailyVolumeDto> dailySeries});
}

/// @nodoc
class __$$AnalyticsSummaryDtoImplCopyWithImpl<$Res>
    extends _$AnalyticsSummaryDtoCopyWithImpl<$Res, _$AnalyticsSummaryDtoImpl>
    implements _$$AnalyticsSummaryDtoImplCopyWith<$Res> {
  __$$AnalyticsSummaryDtoImplCopyWithImpl(_$AnalyticsSummaryDtoImpl _value,
      $Res Function(_$AnalyticsSummaryDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of AnalyticsSummaryDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalVolume = null,
    Object? totalCount = null,
    Object? successVolume = null,
    Object? successCount = null,
    Object? failCount = null,
    Object? currency = null,
    Object? dailySeries = null,
  }) {
    return _then(_$AnalyticsSummaryDtoImpl(
      totalVolume: null == totalVolume
          ? _value.totalVolume
          : totalVolume // ignore: cast_nullable_to_non_nullable
              as String,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
      successVolume: null == successVolume
          ? _value.successVolume
          : successVolume // ignore: cast_nullable_to_non_nullable
              as String,
      successCount: null == successCount
          ? _value.successCount
          : successCount // ignore: cast_nullable_to_non_nullable
              as int,
      failCount: null == failCount
          ? _value.failCount
          : failCount // ignore: cast_nullable_to_non_nullable
              as int,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      dailySeries: null == dailySeries
          ? _value._dailySeries
          : dailySeries // ignore: cast_nullable_to_non_nullable
              as List<DailyVolumeDto>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyticsSummaryDtoImpl implements _AnalyticsSummaryDto {
  const _$AnalyticsSummaryDtoImpl(
      {required this.totalVolume,
      required this.totalCount,
      required this.successVolume,
      required this.successCount,
      required this.failCount,
      required this.currency,
      required final List<DailyVolumeDto> dailySeries})
      : _dailySeries = dailySeries;

  factory _$AnalyticsSummaryDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyticsSummaryDtoImplFromJson(json);

  @override
  final String totalVolume;
  @override
  final int totalCount;
  @override
  final String successVolume;
  @override
  final int successCount;
  @override
  final int failCount;
  @override
  final String currency;
  final List<DailyVolumeDto> _dailySeries;
  @override
  List<DailyVolumeDto> get dailySeries {
    if (_dailySeries is EqualUnmodifiableListView) return _dailySeries;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_dailySeries);
  }

  @override
  String toString() {
    return 'AnalyticsSummaryDto(totalVolume: $totalVolume, totalCount: $totalCount, successVolume: $successVolume, successCount: $successCount, failCount: $failCount, currency: $currency, dailySeries: $dailySeries)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyticsSummaryDtoImpl &&
            (identical(other.totalVolume, totalVolume) ||
                other.totalVolume == totalVolume) &&
            (identical(other.totalCount, totalCount) ||
                other.totalCount == totalCount) &&
            (identical(other.successVolume, successVolume) ||
                other.successVolume == successVolume) &&
            (identical(other.successCount, successCount) ||
                other.successCount == successCount) &&
            (identical(other.failCount, failCount) ||
                other.failCount == failCount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            const DeepCollectionEquality()
                .equals(other._dailySeries, _dailySeries));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      totalVolume,
      totalCount,
      successVolume,
      successCount,
      failCount,
      currency,
      const DeepCollectionEquality().hash(_dailySeries));

  /// Create a copy of AnalyticsSummaryDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyticsSummaryDtoImplCopyWith<_$AnalyticsSummaryDtoImpl> get copyWith =>
      __$$AnalyticsSummaryDtoImplCopyWithImpl<_$AnalyticsSummaryDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyticsSummaryDtoImplToJson(
      this,
    );
  }
}

abstract class _AnalyticsSummaryDto implements AnalyticsSummaryDto {
  const factory _AnalyticsSummaryDto(
          {required final String totalVolume,
          required final int totalCount,
          required final String successVolume,
          required final int successCount,
          required final int failCount,
          required final String currency,
          required final List<DailyVolumeDto> dailySeries}) =
      _$AnalyticsSummaryDtoImpl;

  factory _AnalyticsSummaryDto.fromJson(Map<String, dynamic> json) =
      _$AnalyticsSummaryDtoImpl.fromJson;

  @override
  String get totalVolume;
  @override
  int get totalCount;
  @override
  String get successVolume;
  @override
  int get successCount;
  @override
  int get failCount;
  @override
  String get currency;
  @override
  List<DailyVolumeDto> get dailySeries;

  /// Create a copy of AnalyticsSummaryDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AnalyticsSummaryDtoImplCopyWith<_$AnalyticsSummaryDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

DailyVolumeDto _$DailyVolumeDtoFromJson(Map<String, dynamic> json) {
  return _DailyVolumeDto.fromJson(json);
}

/// @nodoc
mixin _$DailyVolumeDto {
  String get date => throw _privateConstructorUsedError;
  String get volume => throw _privateConstructorUsedError;
  int get count => throw _privateConstructorUsedError;

  /// Serializes this DailyVolumeDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DailyVolumeDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DailyVolumeDtoCopyWith<DailyVolumeDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DailyVolumeDtoCopyWith<$Res> {
  factory $DailyVolumeDtoCopyWith(
          DailyVolumeDto value, $Res Function(DailyVolumeDto) then) =
      _$DailyVolumeDtoCopyWithImpl<$Res, DailyVolumeDto>;
  @useResult
  $Res call({String date, String volume, int count});
}

/// @nodoc
class _$DailyVolumeDtoCopyWithImpl<$Res, $Val extends DailyVolumeDto>
    implements $DailyVolumeDtoCopyWith<$Res> {
  _$DailyVolumeDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DailyVolumeDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? volume = null,
    Object? count = null,
  }) {
    return _then(_value.copyWith(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      volume: null == volume
          ? _value.volume
          : volume // ignore: cast_nullable_to_non_nullable
              as String,
      count: null == count
          ? _value.count
          : count // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DailyVolumeDtoImplCopyWith<$Res>
    implements $DailyVolumeDtoCopyWith<$Res> {
  factory _$$DailyVolumeDtoImplCopyWith(_$DailyVolumeDtoImpl value,
          $Res Function(_$DailyVolumeDtoImpl) then) =
      __$$DailyVolumeDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String date, String volume, int count});
}

/// @nodoc
class __$$DailyVolumeDtoImplCopyWithImpl<$Res>
    extends _$DailyVolumeDtoCopyWithImpl<$Res, _$DailyVolumeDtoImpl>
    implements _$$DailyVolumeDtoImplCopyWith<$Res> {
  __$$DailyVolumeDtoImplCopyWithImpl(
      _$DailyVolumeDtoImpl _value, $Res Function(_$DailyVolumeDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of DailyVolumeDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? volume = null,
    Object? count = null,
  }) {
    return _then(_$DailyVolumeDtoImpl(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as String,
      volume: null == volume
          ? _value.volume
          : volume // ignore: cast_nullable_to_non_nullable
              as String,
      count: null == count
          ? _value.count
          : count // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DailyVolumeDtoImpl implements _DailyVolumeDto {
  const _$DailyVolumeDtoImpl(
      {required this.date, required this.volume, required this.count});

  factory _$DailyVolumeDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$DailyVolumeDtoImplFromJson(json);

  @override
  final String date;
  @override
  final String volume;
  @override
  final int count;

  @override
  String toString() {
    return 'DailyVolumeDto(date: $date, volume: $volume, count: $count)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DailyVolumeDtoImpl &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.volume, volume) || other.volume == volume) &&
            (identical(other.count, count) || other.count == count));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, date, volume, count);

  /// Create a copy of DailyVolumeDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DailyVolumeDtoImplCopyWith<_$DailyVolumeDtoImpl> get copyWith =>
      __$$DailyVolumeDtoImplCopyWithImpl<_$DailyVolumeDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DailyVolumeDtoImplToJson(
      this,
    );
  }
}

abstract class _DailyVolumeDto implements DailyVolumeDto {
  const factory _DailyVolumeDto(
      {required final String date,
      required final String volume,
      required final int count}) = _$DailyVolumeDtoImpl;

  factory _DailyVolumeDto.fromJson(Map<String, dynamic> json) =
      _$DailyVolumeDtoImpl.fromJson;

  @override
  String get date;
  @override
  String get volume;
  @override
  int get count;

  /// Create a copy of DailyVolumeDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DailyVolumeDtoImplCopyWith<_$DailyVolumeDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
