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
  String get type => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get expiresAt => throw _privateConstructorUsedError;
  String? get createdAt => throw _privateConstructorUsedError;
  Map<String, dynamic>? get metadata => throw _privateConstructorUsedError;

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
      String type,
      String status,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      String? createdAt,
      Map<String, dynamic>? metadata});
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
    Object? type = null,
    Object? status = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? createdAt = freezed,
    Object? metadata = freezed,
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
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
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
      String type,
      String status,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      String? createdAt,
      Map<String, dynamic>? metadata});
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
    Object? type = null,
    Object? status = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? createdAt = freezed,
    Object? metadata = freezed,
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
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value._metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PaymentLinkDtoImpl implements _PaymentLinkDto {
  const _$PaymentLinkDtoImpl(
      {required this.id,
      required this.slug,
      required this.type,
      required this.status,
      this.amount,
      required this.currency,
      this.description,
      this.expiresAt,
      this.createdAt,
      final Map<String, dynamic>? metadata})
      : _metadata = metadata;

  factory _$PaymentLinkDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PaymentLinkDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String slug;
  @override
  final String type;
  @override
  final String status;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String? description;
  @override
  final String? expiresAt;
  @override
  final String? createdAt;
  final Map<String, dynamic>? _metadata;
  @override
  Map<String, dynamic>? get metadata {
    final value = _metadata;
    if (value == null) return null;
    if (_metadata is EqualUnmodifiableMapView) return _metadata;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'PaymentLinkDto(id: $id, slug: $slug, type: $type, status: $status, amount: $amount, currency: $currency, description: $description, expiresAt: $expiresAt, createdAt: $createdAt, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PaymentLinkDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            const DeepCollectionEquality().equals(other._metadata, _metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      slug,
      type,
      status,
      amount,
      currency,
      description,
      expiresAt,
      createdAt,
      const DeepCollectionEquality().hash(_metadata));

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
      required final String type,
      required final String status,
      final String? amount,
      required final String currency,
      final String? description,
      final String? expiresAt,
      final String? createdAt,
      final Map<String, dynamic>? metadata}) = _$PaymentLinkDtoImpl;

  factory _PaymentLinkDto.fromJson(Map<String, dynamic> json) =
      _$PaymentLinkDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get slug;
  @override
  String get type;
  @override
  String get status;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String? get description;
  @override
  String? get expiresAt;
  @override
  String? get createdAt;
  @override
  Map<String, dynamic>? get metadata;

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
  String get type => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get expiresAt => throw _privateConstructorUsedError;
  Map<String, dynamic>? get metadata => throw _privateConstructorUsedError;
  String? get recipientMsisdn => throw _privateConstructorUsedError;
  String? get providerCode => throw _privateConstructorUsedError;
  String? get recurrenceInterval => throw _privateConstructorUsedError;
  int? get maxCycles => throw _privateConstructorUsedError;

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
      {String type,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      Map<String, dynamic>? metadata,
      String? recipientMsisdn,
      String? providerCode,
      String? recurrenceInterval,
      int? maxCycles});
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
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? metadata = freezed,
    Object? recipientMsisdn = freezed,
    Object? providerCode = freezed,
    Object? recurrenceInterval = freezed,
    Object? maxCycles = freezed,
  }) {
    return _then(_value.copyWith(
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
      recipientMsisdn: freezed == recipientMsisdn
          ? _value.recipientMsisdn
          : recipientMsisdn // ignore: cast_nullable_to_non_nullable
              as String?,
      providerCode: freezed == providerCode
          ? _value.providerCode
          : providerCode // ignore: cast_nullable_to_non_nullable
              as String?,
      recurrenceInterval: freezed == recurrenceInterval
          ? _value.recurrenceInterval
          : recurrenceInterval // ignore: cast_nullable_to_non_nullable
              as String?,
      maxCycles: freezed == maxCycles
          ? _value.maxCycles
          : maxCycles // ignore: cast_nullable_to_non_nullable
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
      {String type,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      Map<String, dynamic>? metadata,
      String? recipientMsisdn,
      String? providerCode,
      String? recurrenceInterval,
      int? maxCycles});
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
    Object? type = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? metadata = freezed,
    Object? recipientMsisdn = freezed,
    Object? providerCode = freezed,
    Object? recurrenceInterval = freezed,
    Object? maxCycles = freezed,
  }) {
    return _then(_$CreateLinkRequestDtoImpl(
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value._metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
      recipientMsisdn: freezed == recipientMsisdn
          ? _value.recipientMsisdn
          : recipientMsisdn // ignore: cast_nullable_to_non_nullable
              as String?,
      providerCode: freezed == providerCode
          ? _value.providerCode
          : providerCode // ignore: cast_nullable_to_non_nullable
              as String?,
      recurrenceInterval: freezed == recurrenceInterval
          ? _value.recurrenceInterval
          : recurrenceInterval // ignore: cast_nullable_to_non_nullable
              as String?,
      maxCycles: freezed == maxCycles
          ? _value.maxCycles
          : maxCycles // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateLinkRequestDtoImpl implements _CreateLinkRequestDto {
  const _$CreateLinkRequestDtoImpl(
      {required this.type,
      this.amount,
      required this.currency,
      this.description,
      this.expiresAt,
      final Map<String, dynamic>? metadata,
      this.recipientMsisdn,
      this.providerCode,
      this.recurrenceInterval,
      this.maxCycles})
      : _metadata = metadata;

  factory _$CreateLinkRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateLinkRequestDtoImplFromJson(json);

  @override
  final String type;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String? description;
  @override
  final String? expiresAt;
  final Map<String, dynamic>? _metadata;
  @override
  Map<String, dynamic>? get metadata {
    final value = _metadata;
    if (value == null) return null;
    if (_metadata is EqualUnmodifiableMapView) return _metadata;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  final String? recipientMsisdn;
  @override
  final String? providerCode;
  @override
  final String? recurrenceInterval;
  @override
  final int? maxCycles;

  @override
  String toString() {
    return 'CreateLinkRequestDto(type: $type, amount: $amount, currency: $currency, description: $description, expiresAt: $expiresAt, metadata: $metadata, recipientMsisdn: $recipientMsisdn, providerCode: $providerCode, recurrenceInterval: $recurrenceInterval, maxCycles: $maxCycles)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateLinkRequestDtoImpl &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            const DeepCollectionEquality().equals(other._metadata, _metadata) &&
            (identical(other.recipientMsisdn, recipientMsisdn) ||
                other.recipientMsisdn == recipientMsisdn) &&
            (identical(other.providerCode, providerCode) ||
                other.providerCode == providerCode) &&
            (identical(other.recurrenceInterval, recurrenceInterval) ||
                other.recurrenceInterval == recurrenceInterval) &&
            (identical(other.maxCycles, maxCycles) ||
                other.maxCycles == maxCycles));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      type,
      amount,
      currency,
      description,
      expiresAt,
      const DeepCollectionEquality().hash(_metadata),
      recipientMsisdn,
      providerCode,
      recurrenceInterval,
      maxCycles);

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
      {required final String type,
      final String? amount,
      required final String currency,
      final String? description,
      final String? expiresAt,
      final Map<String, dynamic>? metadata,
      final String? recipientMsisdn,
      final String? providerCode,
      final String? recurrenceInterval,
      final int? maxCycles}) = _$CreateLinkRequestDtoImpl;

  factory _CreateLinkRequestDto.fromJson(Map<String, dynamic> json) =
      _$CreateLinkRequestDtoImpl.fromJson;

  @override
  String get type;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String? get description;
  @override
  String? get expiresAt;
  @override
  Map<String, dynamic>? get metadata;
  @override
  String? get recipientMsisdn;
  @override
  String? get providerCode;
  @override
  String? get recurrenceInterval;
  @override
  int? get maxCycles;

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
  String get type => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get expiresAt => throw _privateConstructorUsedError;
  String? get createdAt => throw _privateConstructorUsedError;
  String? get qrCodeBase64 => throw _privateConstructorUsedError;
  Map<String, dynamic>? get metadata => throw _privateConstructorUsedError;

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
      String type,
      String status,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      String? createdAt,
      String? qrCodeBase64,
      Map<String, dynamic>? metadata});
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
    Object? type = null,
    Object? status = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? createdAt = freezed,
    Object? qrCodeBase64 = freezed,
    Object? metadata = freezed,
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
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      qrCodeBase64: freezed == qrCodeBase64
          ? _value.qrCodeBase64
          : qrCodeBase64 // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value.metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
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
      String type,
      String status,
      String? amount,
      String currency,
      String? description,
      String? expiresAt,
      String? createdAt,
      String? qrCodeBase64,
      Map<String, dynamic>? metadata});
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
    Object? type = null,
    Object? status = null,
    Object? amount = freezed,
    Object? currency = null,
    Object? description = freezed,
    Object? expiresAt = freezed,
    Object? createdAt = freezed,
    Object? qrCodeBase64 = freezed,
    Object? metadata = freezed,
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
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
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
      expiresAt: freezed == expiresAt
          ? _value.expiresAt
          : expiresAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      qrCodeBase64: freezed == qrCodeBase64
          ? _value.qrCodeBase64
          : qrCodeBase64 // ignore: cast_nullable_to_non_nullable
              as String?,
      metadata: freezed == metadata
          ? _value._metadata
          : metadata // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$LinkDetailDtoImpl implements _LinkDetailDto {
  const _$LinkDetailDtoImpl(
      {required this.id,
      required this.slug,
      required this.type,
      required this.status,
      this.amount,
      required this.currency,
      this.description,
      this.expiresAt,
      this.createdAt,
      this.qrCodeBase64,
      final Map<String, dynamic>? metadata})
      : _metadata = metadata;

  factory _$LinkDetailDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$LinkDetailDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String slug;
  @override
  final String type;
  @override
  final String status;
  @override
  final String? amount;
  @override
  final String currency;
  @override
  final String? description;
  @override
  final String? expiresAt;
  @override
  final String? createdAt;
  @override
  final String? qrCodeBase64;
  final Map<String, dynamic>? _metadata;
  @override
  Map<String, dynamic>? get metadata {
    final value = _metadata;
    if (value == null) return null;
    if (_metadata is EqualUnmodifiableMapView) return _metadata;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'LinkDetailDto(id: $id, slug: $slug, type: $type, status: $status, amount: $amount, currency: $currency, description: $description, expiresAt: $expiresAt, createdAt: $createdAt, qrCodeBase64: $qrCodeBase64, metadata: $metadata)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LinkDetailDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.qrCodeBase64, qrCodeBase64) ||
                other.qrCodeBase64 == qrCodeBase64) &&
            const DeepCollectionEquality().equals(other._metadata, _metadata));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      slug,
      type,
      status,
      amount,
      currency,
      description,
      expiresAt,
      createdAt,
      qrCodeBase64,
      const DeepCollectionEquality().hash(_metadata));

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
      required final String type,
      required final String status,
      final String? amount,
      required final String currency,
      final String? description,
      final String? expiresAt,
      final String? createdAt,
      final String? qrCodeBase64,
      final Map<String, dynamic>? metadata}) = _$LinkDetailDtoImpl;

  factory _LinkDetailDto.fromJson(Map<String, dynamic> json) =
      _$LinkDetailDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get slug;
  @override
  String get type;
  @override
  String get status;
  @override
  String? get amount;
  @override
  String get currency;
  @override
  String? get description;
  @override
  String? get expiresAt;
  @override
  String? get createdAt;
  @override
  String? get qrCodeBase64;
  @override
  Map<String, dynamic>? get metadata;

  /// Create a copy of LinkDetailDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LinkDetailDtoImplCopyWith<_$LinkDetailDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
