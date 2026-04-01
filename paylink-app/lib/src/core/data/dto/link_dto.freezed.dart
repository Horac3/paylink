// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'link_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

PaymentLinkDto _$PaymentLinkDtoFromJson(Map<String, dynamic> json) {
  return _PaymentLinkDto.fromJson(json);
}

/// @nodoc
mixin _$PaymentLinkDto {
  String get id => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  int? get useCount => throw _privateConstructorUsedError;
  int? get maxUses => throw _privateConstructorUsedError;

  /// Serializes this PaymentLinkDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PaymentLinkDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PaymentLinkDtoCopyWith<PaymentLinkDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PaymentLinkDtoCopyWith<$Res> {
  factory $PaymentLinkDtoCopyWith(
          PaymentLinkDto value, $Res Function(PaymentLinkDto) then) =
      _$PaymentLinkDtoCopyWithImpl<$Res, PaymentLinkDto>;
  @useResult
  $Res call(
      {String id,
      String slug,
      String title,
      String type,
      String? amount,
      String currency,
      String status,
      String createdAt,
      int? useCount,
      int? maxUses});
}

/// @nodoc
class _$PaymentLinkDtoCopyWithImpl<$Res, $Val extends PaymentLinkDto>
    implements $PaymentLinkDtoCopyWith<$Res> {
  _$PaymentLinkDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PaymentLinkDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? slug = null,
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? status = null,
    Object? createdAt = null,
    Object? useCount = freezed,
    Object? maxUses = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      useCount: freezed == useCount
          ? _value.useCount
          : useCount // ignore: cast_nullable_to_non_nullable
              as int?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PaymentLinkDtoImplCopyWith<$Res>
    implements $PaymentLinkDtoCopyWith<$Res> {
  factory _$$PaymentLinkDtoImplCopyWith(_$PaymentLinkDtoImpl value,
          $Res Function(_$PaymentLinkDtoImpl) then) =
      __$$PaymentLinkDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String slug,
      String title,
      String type,
      String? amount,
      String currency,
      String status,
      String createdAt,
      int? useCount,
      int? maxUses});
}

/// @nodoc
class __$$PaymentLinkDtoImplCopyWithImpl<$Res>
    extends _$PaymentLinkDtoCopyWithImpl<$Res, _$PaymentLinkDtoImpl>
    implements _$$PaymentLinkDtoImplCopyWith<$Res> {
  __$$PaymentLinkDtoImplCopyWithImpl(
      _$PaymentLinkDtoImpl _value, $Res Function(_$PaymentLinkDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of PaymentLinkDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? slug = null,
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? status = null,
    Object? createdAt = null,
    Object? useCount = freezed,
    Object? maxUses = freezed,
  }) {
    return _then(_$PaymentLinkDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      useCount: freezed == useCount
          ? _value.useCount
          : useCount // ignore: cast_nullable_to_non_nullable
              as int?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PaymentLinkDtoImpl implements _PaymentLinkDto {
  const _$PaymentLinkDtoImpl(
      {required this.id,
      required this.slug,
      required this.title,
      required this.type,
      this.amount,
      required this.currency,
      required this.status,
      required this.createdAt,
      this.useCount,
      this.maxUses});

  factory _$PaymentLinkDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PaymentLinkDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String slug;
  @override
  final String title;
  @override
  final String type;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String status;
  @override
  final String createdAt;
  @override
  final int? useCount;
  @override
  final int? maxUses;

  @override
  String toString() {
    return 'PaymentLinkDto(id: $id, slug: $slug, title: $title, type: $type, amount: $amount, currency: $currency, status: $status, createdAt: $createdAt, useCount: $useCount, maxUses: $maxUses)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PaymentLinkDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.useCount, useCount) ||
                other.useCount == useCount) &&
            (identical(other.maxUses, maxUses) || other.maxUses == maxUses));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, slug, title, type, amount,
      currency, status, createdAt, useCount, maxUses);

  /// Create a copy of PaymentLinkDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PaymentLinkDtoImplCopyWith<_$PaymentLinkDtoImpl> get copyWith =>
      __$$PaymentLinkDtoImplCopyWithImpl<_$PaymentLinkDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PaymentLinkDtoImplToJson(
      this,
    );
  }
}

abstract class _PaymentLinkDto implements PaymentLinkDto {
  const factory _PaymentLinkDto(
      {required final String id,
      required final String slug,
      required final String title,
      required final String type,
      final String? amount,
      required final String currency,
      required final String status,
      required final String createdAt,
      final int? useCount,
      final int? maxUses}) = _$PaymentLinkDtoImpl;

  factory _PaymentLinkDto.fromJson(Map<String, dynamic> json) =
      _$PaymentLinkDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get slug;
  @override
  String get title;
  @override
  String get type;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String get status;
  @override
  String get createdAt;
  @override
  int? get useCount;
  @override
  int? get maxUses;

  /// Create a copy of PaymentLinkDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PaymentLinkDtoImplCopyWith<_$PaymentLinkDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreateLinkRequestDto _$CreateLinkRequestDtoFromJson(Map<String, dynamic> json) {
  return _CreateLinkRequestDto.fromJson(json);
}

/// @nodoc
mixin _$CreateLinkRequestDto {
  String get title => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  int? get maxUses => throw _privateConstructorUsedError;

  /// Serializes this CreateLinkRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateLinkRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateLinkRequestDtoCopyWith<CreateLinkRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateLinkRequestDtoCopyWith<$Res> {
  factory $CreateLinkRequestDtoCopyWith(CreateLinkRequestDto value,
          $Res Function(CreateLinkRequestDto) then) =
      _$CreateLinkRequestDtoCopyWithImpl<$Res, CreateLinkRequestDto>;
  @useResult
  $Res call(
      {String title,
      String type,
      String? amount,
      String currency,
      String? description,
      int? maxUses});
}

/// @nodoc
class _$CreateLinkRequestDtoCopyWithImpl<$Res,
        $Val extends CreateLinkRequestDto>
    implements $CreateLinkRequestDtoCopyWith<$Res> {
  _$CreateLinkRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateLinkRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? maxUses = freezed,
  }) {
    return _then(_value.copyWith(
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CreateLinkRequestDtoImplCopyWith<$Res>
    implements $CreateLinkRequestDtoCopyWith<$Res> {
  factory _$$CreateLinkRequestDtoImplCopyWith(_$CreateLinkRequestDtoImpl value,
          $Res Function(_$CreateLinkRequestDtoImpl) then) =
      __$$CreateLinkRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String title,
      String type,
      String? amount,
      String currency,
      String? description,
      int? maxUses});
}

/// @nodoc
class __$$CreateLinkRequestDtoImplCopyWithImpl<$Res>
    extends _$CreateLinkRequestDtoCopyWithImpl<$Res, _$CreateLinkRequestDtoImpl>
    implements _$$CreateLinkRequestDtoImplCopyWith<$Res> {
  __$$CreateLinkRequestDtoImplCopyWithImpl(_$CreateLinkRequestDtoImpl _value,
      $Res Function(_$CreateLinkRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of CreateLinkRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? maxUses = freezed,
  }) {
    return _then(_$CreateLinkRequestDtoImpl(
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateLinkRequestDtoImpl implements _CreateLinkRequestDto {
  const _$CreateLinkRequestDtoImpl(
      {required this.title,
      required this.type,
      this.amount,
      required this.currency,
      this.description,
      this.maxUses});

  factory _$CreateLinkRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateLinkRequestDtoImplFromJson(json);

  @override
  final String title;
  @override
  final String type;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String? description;
  @override
  final int? maxUses;

  @override
  String toString() {
    return 'CreateLinkRequestDto(title: $title, type: $type, amount: $amount, currency: $currency, description: $description, maxUses: $maxUses)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateLinkRequestDtoImpl &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.maxUses, maxUses) || other.maxUses == maxUses));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, title, type, amount, currency, description, maxUses);

  /// Create a copy of CreateLinkRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateLinkRequestDtoImplCopyWith<_$CreateLinkRequestDtoImpl>
      get copyWith =>
          __$$CreateLinkRequestDtoImplCopyWithImpl<_$CreateLinkRequestDtoImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateLinkRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _CreateLinkRequestDto implements CreateLinkRequestDto {
  const factory _CreateLinkRequestDto(
      {required final String title,
      required final String type,
      final String? amount,
      required final String currency,
      final String? description,
      final int? maxUses}) = _$CreateLinkRequestDtoImpl;

  factory _CreateLinkRequestDto.fromJson(Map<String, dynamic> json) =
      _$CreateLinkRequestDtoImpl.fromJson;

  @override
  String get title;
  @override
  String get type;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String? get description;
  @override
  int? get maxUses;

  /// Create a copy of CreateLinkRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateLinkRequestDtoImplCopyWith<_$CreateLinkRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

BulkSendRequestDto _$BulkSendRequestDtoFromJson(Map<String, dynamic> json) {
  return _BulkSendRequestDto.fromJson(json);
}

/// @nodoc
mixin _$BulkSendRequestDto {
  String get linkId => throw _privateConstructorUsedError;
  List<String> get msisdns => throw _privateConstructorUsedError;

  /// Serializes this BulkSendRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BulkSendRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BulkSendRequestDtoCopyWith<BulkSendRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BulkSendRequestDtoCopyWith<$Res> {
  factory $BulkSendRequestDtoCopyWith(
          BulkSendRequestDto value, $Res Function(BulkSendRequestDto) then) =
      _$BulkSendRequestDtoCopyWithImpl<$Res, BulkSendRequestDto>;
  @useResult
  $Res call({String linkId, List<String> msisdns});
}

/// @nodoc
class _$BulkSendRequestDtoCopyWithImpl<$Res, $Val extends BulkSendRequestDto>
    implements $BulkSendRequestDtoCopyWith<$Res> {
  _$BulkSendRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BulkSendRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? linkId = null,
    Object? msisdns = null,
  }) {
    return _then(_value.copyWith(
      linkId: null == linkId
          ? _value.linkId
          : linkId // ignore: cast_nullable_to_non_nullable
              as String,
      msisdns: null == msisdns
          ? _value.msisdns
          : msisdns // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$BulkSendRequestDtoImplCopyWith<$Res>
    implements $BulkSendRequestDtoCopyWith<$Res> {
  factory _$$BulkSendRequestDtoImplCopyWith(_$BulkSendRequestDtoImpl value,
          $Res Function(_$BulkSendRequestDtoImpl) then) =
      __$$BulkSendRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String linkId, List<String> msisdns});
}

/// @nodoc
class __$$BulkSendRequestDtoImplCopyWithImpl<$Res>
    extends _$BulkSendRequestDtoCopyWithImpl<$Res, _$BulkSendRequestDtoImpl>
    implements _$$BulkSendRequestDtoImplCopyWith<$Res> {
  __$$BulkSendRequestDtoImplCopyWithImpl(_$BulkSendRequestDtoImpl _value,
      $Res Function(_$BulkSendRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of BulkSendRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? linkId = null,
    Object? msisdns = null,
  }) {
    return _then(_$BulkSendRequestDtoImpl(
      linkId: null == linkId
          ? _value.linkId
          : linkId // ignore: cast_nullable_to_non_nullable
              as String,
      msisdns: null == msisdns
          ? _value._msisdns
          : msisdns // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$BulkSendRequestDtoImpl implements _BulkSendRequestDto {
  const _$BulkSendRequestDtoImpl(
      {required this.linkId, required final List<String> msisdns})
      : _msisdns = msisdns;

  factory _$BulkSendRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$BulkSendRequestDtoImplFromJson(json);

  @override
  final String linkId;
  final List<String> _msisdns;
  @override
  List<String> get msisdns {
    if (_msisdns is EqualUnmodifiableListView) return _msisdns;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_msisdns);
  }

  @override
  String toString() {
    return 'BulkSendRequestDto(linkId: $linkId, msisdns: $msisdns)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BulkSendRequestDtoImpl &&
            (identical(other.linkId, linkId) || other.linkId == linkId) &&
            const DeepCollectionEquality().equals(other._msisdns, _msisdns));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, linkId, const DeepCollectionEquality().hash(_msisdns));

  /// Create a copy of BulkSendRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BulkSendRequestDtoImplCopyWith<_$BulkSendRequestDtoImpl> get copyWith =>
      __$$BulkSendRequestDtoImplCopyWithImpl<_$BulkSendRequestDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BulkSendRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _BulkSendRequestDto implements BulkSendRequestDto {
  const factory _BulkSendRequestDto(
      {required final String linkId,
      required final List<String> msisdns}) = _$BulkSendRequestDtoImpl;

  factory _BulkSendRequestDto.fromJson(Map<String, dynamic> json) =
      _$BulkSendRequestDtoImpl.fromJson;

  @override
  String get linkId;
  @override
  List<String> get msisdns;

  /// Create a copy of BulkSendRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BulkSendRequestDtoImplCopyWith<_$BulkSendRequestDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

LinkDetailDto _$LinkDetailDtoFromJson(Map<String, dynamic> json) {
  return _LinkDetailDto.fromJson(json);
}

/// @nodoc
mixin _$LinkDetailDto {
  String get id => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  int? get useCount => throw _privateConstructorUsedError;
  int? get maxUses => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get deepLink => throw _privateConstructorUsedError;

  /// Serializes this LinkDetailDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LinkDetailDtoCopyWith<LinkDetailDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LinkDetailDtoCopyWith<$Res> {
  factory $LinkDetailDtoCopyWith(
          LinkDetailDto value, $Res Function(LinkDetailDto) then) =
      _$LinkDetailDtoCopyWithImpl<$Res, LinkDetailDto>;
  @useResult
  $Res call(
      {String id,
      String slug,
      String title,
      String type,
      String? amount,
      String currency,
      String status,
      String createdAt,
      int? useCount,
      int? maxUses,
      String? description,
      String? deepLink});
}

/// @nodoc
class _$LinkDetailDtoCopyWithImpl<$Res, $Val extends LinkDetailDto>
    implements $LinkDetailDtoCopyWith<$Res> {
  _$LinkDetailDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? slug = null,
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? status = null,
    Object? createdAt = null,
    Object? useCount = freezed,
    Object? maxUses = freezed,
    Object? description = freezed,
    Object? deepLink = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      useCount: freezed == useCount
          ? _value.useCount
          : useCount // ignore: cast_nullable_to_non_nullable
              as int?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      deepLink: freezed == deepLink
          ? _value.deepLink
          : deepLink // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$LinkDetailDtoImplCopyWith<$Res>
    implements $LinkDetailDtoCopyWith<$Res> {
  factory _$$LinkDetailDtoImplCopyWith(
          _$LinkDetailDtoImpl value, $Res Function(_$LinkDetailDtoImpl) then) =
      __$$LinkDetailDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String slug,
      String title,
      String type,
      String? amount,
      String currency,
      String status,
      String createdAt,
      int? useCount,
      int? maxUses,
      String? description,
      String? deepLink});
}

/// @nodoc
class __$$LinkDetailDtoImplCopyWithImpl<$Res>
    extends _$LinkDetailDtoCopyWithImpl<$Res, _$LinkDetailDtoImpl>
    implements _$$LinkDetailDtoImplCopyWith<$Res> {
  __$$LinkDetailDtoImplCopyWithImpl(
      _$LinkDetailDtoImpl _value, $Res Function(_$LinkDetailDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? slug = null,
    Object? title = null,
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? status = null,
    Object? createdAt = null,
    Object? useCount = freezed,
    Object? maxUses = freezed,
    Object? description = freezed,
    Object? deepLink = freezed,
  }) {
    return _then(_$LinkDetailDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      slug: null == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      useCount: freezed == useCount
          ? _value.useCount
          : useCount // ignore: cast_nullable_to_non_nullable
              as int?,
      maxUses: freezed == maxUses
          ? _value.maxUses
          : maxUses // ignore: cast_nullable_to_non_nullable
              as int?,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      deepLink: freezed == deepLink
          ? _value.deepLink
          : deepLink // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$LinkDetailDtoImpl implements _LinkDetailDto {
  const _$LinkDetailDtoImpl(
      {required this.id,
      required this.slug,
      required this.title,
      required this.type,
      this.amount,
      required this.currency,
      required this.status,
      required this.createdAt,
      this.useCount,
      this.maxUses,
      this.description,
      this.deepLink});

  factory _$LinkDetailDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$LinkDetailDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String slug;
  @override
  final String title;
  @override
  final String type;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String status;
  @override
  final String createdAt;
  @override
  final int? useCount;
  @override
  final int? maxUses;
  @override
  final String? description;
  @override
  final String? deepLink;

  @override
  String toString() {
    return 'LinkDetailDto(id: $id, slug: $slug, title: $title, type: $type, amount: $amount, currency: $currency, status: $status, createdAt: $createdAt, useCount: $useCount, maxUses: $maxUses, description: $description, deepLink: $deepLink)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LinkDetailDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.useCount, useCount) ||
                other.useCount == useCount) &&
            (identical(other.maxUses, maxUses) || other.maxUses == maxUses) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.deepLink, deepLink) ||
                other.deepLink == deepLink));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, slug, title, type, amount,
      currency, status, createdAt, useCount, maxUses, description, deepLink);

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LinkDetailDtoImplCopyWith<_$LinkDetailDtoImpl> get copyWith =>
      __$$LinkDetailDtoImplCopyWithImpl<_$LinkDetailDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LinkDetailDtoImplToJson(
      this,
    );
  }
}

abstract class _LinkDetailDto implements LinkDetailDto {
  const factory _LinkDetailDto(
      {required final String id,
      required final String slug,
      required final String title,
      required final String type,
      final String? amount,
      required final String currency,
      required final String status,
      required final String createdAt,
      final int? useCount,
      final int? maxUses,
      final String? description,
      final String? deepLink}) = _$LinkDetailDtoImpl;

  factory _LinkDetailDto.fromJson(Map<String, dynamic> json) =
      _$LinkDetailDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get slug;
  @override
  String get title;
  @override
  String get type;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String get status;
  @override
  String get createdAt;
  @override
  int? get useCount;
  @override
  int? get maxUses;
  @override
  String? get description;
  @override
  String? get deepLink;

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LinkDetailDtoImplCopyWith<_$LinkDetailDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
