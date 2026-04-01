// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'transaction_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

TransactionDto _$TransactionDtoFromJson(Map<String, dynamic> json) {
  return _TransactionDto.fromJson(json);
}

/// @nodoc
mixin _$TransactionDto {
  String get id => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String get msisdnHint => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String? get failureReason => throw _privateConstructorUsedError;
  String? get linkId => throw _privateConstructorUsedError;
  String? get linkTitle => throw _privateConstructorUsedError;

  /// Serializes this TransactionDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TransactionDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TransactionDtoCopyWith<TransactionDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TransactionDtoCopyWith<$Res> {
  factory $TransactionDtoCopyWith(
          TransactionDto value, $Res Function(TransactionDto) then) =
      _$TransactionDtoCopyWithImpl<$Res, TransactionDto>;
  @useResult
  $Res call(
      {String id,
      String status,
      String amount,
      String currency,
      String msisdnHint,
      String createdAt,
      String? failureReason,
      String? linkId,
      String? linkTitle});
}

/// @nodoc
class _$TransactionDtoCopyWithImpl<$Res, $Val extends TransactionDto>
    implements $TransactionDtoCopyWith<$Res> {
  _$TransactionDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TransactionDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? status = null,
    Object? amount = null,
    Object? currency = null,
    Object? msisdnHint = null,
    Object? createdAt = null,
    Object? failureReason = freezed,
    Object? linkId = freezed,
    Object? linkTitle = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      msisdnHint: null == msisdnHint
          ? _value.msisdnHint
          : msisdnHint // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      failureReason: freezed == failureReason
          ? _value.failureReason
          : failureReason // ignore: cast_nullable_to_non_nullable
              as String?,
      linkId: freezed == linkId
          ? _value.linkId
          : linkId // ignore: cast_nullable_to_non_nullable
              as String?,
      linkTitle: freezed == linkTitle
          ? _value.linkTitle
          : linkTitle // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TransactionDtoImplCopyWith<$Res>
    implements $TransactionDtoCopyWith<$Res> {
  factory _$$TransactionDtoImplCopyWith(_$TransactionDtoImpl value,
          $Res Function(_$TransactionDtoImpl) then) =
      __$$TransactionDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String status,
      String amount,
      String currency,
      String msisdnHint,
      String createdAt,
      String? failureReason,
      String? linkId,
      String? linkTitle});
}

/// @nodoc
class __$$TransactionDtoImplCopyWithImpl<$Res>
    extends _$TransactionDtoCopyWithImpl<$Res, _$TransactionDtoImpl>
    implements _$$TransactionDtoImplCopyWith<$Res> {
  __$$TransactionDtoImplCopyWithImpl(
      _$TransactionDtoImpl _value, $Res Function(_$TransactionDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of TransactionDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? status = null,
    Object? amount = null,
    Object? currency = null,
    Object? msisdnHint = null,
    Object? createdAt = null,
    Object? failureReason = freezed,
    Object? linkId = freezed,
    Object? linkTitle = freezed,
  }) {
    return _then(_$TransactionDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String,
      currency: null == currency
          ? _value.currency
          : currency // ignore: cast_nullable_to_non_nullable
              as String,
      msisdnHint: null == msisdnHint
          ? _value.msisdnHint
          : msisdnHint // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      failureReason: freezed == failureReason
          ? _value.failureReason
          : failureReason // ignore: cast_nullable_to_non_nullable
              as String?,
      linkId: freezed == linkId
          ? _value.linkId
          : linkId // ignore: cast_nullable_to_non_nullable
              as String?,
      linkTitle: freezed == linkTitle
          ? _value.linkTitle
          : linkTitle // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TransactionDtoImpl implements _TransactionDto {
  const _$TransactionDtoImpl(
      {required this.id,
      required this.status,
      required this.amount,
      required this.currency,
      required this.msisdnHint,
      required this.createdAt,
      this.failureReason,
      this.linkId,
      this.linkTitle});

  factory _$TransactionDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$TransactionDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String status;
  @override
  final String amount;
  @override
  final String currency;
  @override
  final String msisdnHint;
  @override
  final String createdAt;
  @override
  final String? failureReason;
  @override
  final String? linkId;
  @override
  final String? linkTitle;

  @override
  String toString() {
    return 'TransactionDto(id: $id, status: $status, amount: $amount, currency: $currency, msisdnHint: $msisdnHint, createdAt: $createdAt, failureReason: $failureReason, linkId: $linkId, linkTitle: $linkTitle)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TransactionDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.msisdnHint, msisdnHint) ||
                other.msisdnHint == msisdnHint) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.failureReason, failureReason) ||
                other.failureReason == failureReason) &&
            (identical(other.linkId, linkId) || other.linkId == linkId) &&
            (identical(other.linkTitle, linkTitle) ||
                other.linkTitle == linkTitle));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, status, amount, currency,
      msisdnHint, createdAt, failureReason, linkId, linkTitle);

  /// Create a copy of TransactionDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TransactionDtoImplCopyWith<_$TransactionDtoImpl> get copyWith =>
      __$$TransactionDtoImplCopyWithImpl<_$TransactionDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TransactionDtoImplToJson(
      this,
    );
  }
}

abstract class _TransactionDto implements TransactionDto {
  const factory _TransactionDto(
      {required final String id,
      required final String status,
      required final String amount,
      required final String currency,
      required final String msisdnHint,
      required final String createdAt,
      final String? failureReason,
      final String? linkId,
      final String? linkTitle}) = _$TransactionDtoImpl;

  factory _TransactionDto.fromJson(Map<String, dynamic> json) =
      _$TransactionDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get status;
  @override
  String get amount;
  @override
  String get currency;
  @override
  String get msisdnHint;
  @override
  String get createdAt;
  @override
  String? get failureReason;
  @override
  String? get linkId;
  @override
  String? get linkTitle;

  /// Create a copy of TransactionDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TransactionDtoImplCopyWith<_$TransactionDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InitiatePaymentRequestDto _$InitiatePaymentRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _InitiatePaymentRequestDto.fromJson(json);
}

/// @nodoc
mixin _$InitiatePaymentRequestDto {
  String get linkSlug => throw _privateConstructorUsedError;
  String get payerSessionToken => throw _privateConstructorUsedError;
  String? get amount => throw _privateConstructorUsedError;

  /// Serializes this InitiatePaymentRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InitiatePaymentRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InitiatePaymentRequestDtoCopyWith<InitiatePaymentRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InitiatePaymentRequestDtoCopyWith<$Res> {
  factory $InitiatePaymentRequestDtoCopyWith(InitiatePaymentRequestDto value,
          $Res Function(InitiatePaymentRequestDto) then) =
      _$InitiatePaymentRequestDtoCopyWithImpl<$Res, InitiatePaymentRequestDto>;
  @useResult
  $Res call({String linkSlug, String payerSessionToken, String? amount});
}

/// @nodoc
class _$InitiatePaymentRequestDtoCopyWithImpl<$Res,
        $Val extends InitiatePaymentRequestDto>
    implements $InitiatePaymentRequestDtoCopyWith<$Res> {
  _$InitiatePaymentRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InitiatePaymentRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? linkSlug = null,
    Object? payerSessionToken = null,
    Object? amount = freezed,
  }) {
    return _then(_value.copyWith(
      linkSlug: null == linkSlug
          ? _value.linkSlug
          : linkSlug // ignore: cast_nullable_to_non_nullable
              as String,
      payerSessionToken: null == payerSessionToken
          ? _value.payerSessionToken
          : payerSessionToken // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$InitiatePaymentRequestDtoImplCopyWith<$Res>
    implements $InitiatePaymentRequestDtoCopyWith<$Res> {
  factory _$$InitiatePaymentRequestDtoImplCopyWith(
          _$InitiatePaymentRequestDtoImpl value,
          $Res Function(_$InitiatePaymentRequestDtoImpl) then) =
      __$$InitiatePaymentRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String linkSlug, String payerSessionToken, String? amount});
}

/// @nodoc
class __$$InitiatePaymentRequestDtoImplCopyWithImpl<$Res>
    extends _$InitiatePaymentRequestDtoCopyWithImpl<$Res,
        _$InitiatePaymentRequestDtoImpl>
    implements _$$InitiatePaymentRequestDtoImplCopyWith<$Res> {
  __$$InitiatePaymentRequestDtoImplCopyWithImpl(
      _$InitiatePaymentRequestDtoImpl _value,
      $Res Function(_$InitiatePaymentRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of InitiatePaymentRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? linkSlug = null,
    Object? payerSessionToken = null,
    Object? amount = freezed,
  }) {
    return _then(_$InitiatePaymentRequestDtoImpl(
      linkSlug: null == linkSlug
          ? _value.linkSlug
          : linkSlug // ignore: cast_nullable_to_non_nullable
              as String,
      payerSessionToken: null == payerSessionToken
          ? _value.payerSessionToken
          : payerSessionToken // ignore: cast_nullable_to_non_nullable
              as String,
      amount: freezed == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$InitiatePaymentRequestDtoImpl implements _InitiatePaymentRequestDto {
  const _$InitiatePaymentRequestDtoImpl(
      {required this.linkSlug, required this.payerSessionToken, this.amount});

  factory _$InitiatePaymentRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$InitiatePaymentRequestDtoImplFromJson(json);

  @override
  final String linkSlug;
  @override
  final String payerSessionToken;
  @override
  final String? amount;

  @override
  String toString() {
    return 'InitiatePaymentRequestDto(linkSlug: $linkSlug, payerSessionToken: $payerSessionToken, amount: $amount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InitiatePaymentRequestDtoImpl &&
            (identical(other.linkSlug, linkSlug) ||
                other.linkSlug == linkSlug) &&
            (identical(other.payerSessionToken, payerSessionToken) ||
                other.payerSessionToken == payerSessionToken) &&
            (identical(other.amount, amount) || other.amount == amount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, linkSlug, payerSessionToken, amount);

  /// Create a copy of InitiatePaymentRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InitiatePaymentRequestDtoImplCopyWith<_$InitiatePaymentRequestDtoImpl>
      get copyWith => __$$InitiatePaymentRequestDtoImplCopyWithImpl<
          _$InitiatePaymentRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$InitiatePaymentRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _InitiatePaymentRequestDto implements InitiatePaymentRequestDto {
  const factory _InitiatePaymentRequestDto(
      {required final String linkSlug,
      required final String payerSessionToken,
      final String? amount}) = _$InitiatePaymentRequestDtoImpl;

  factory _InitiatePaymentRequestDto.fromJson(Map<String, dynamic> json) =
      _$InitiatePaymentRequestDtoImpl.fromJson;

  @override
  String get linkSlug;
  @override
  String get payerSessionToken;
  @override
  String? get amount;

  /// Create a copy of InitiatePaymentRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InitiatePaymentRequestDtoImplCopyWith<_$InitiatePaymentRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

InitiatePaymentResponseDto _$InitiatePaymentResponseDtoFromJson(
    Map<String, dynamic> json) {
  return _InitiatePaymentResponseDto.fromJson(json);
}

/// @nodoc
mixin _$InitiatePaymentResponseDto {
  String get transactionId => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String? get depositId => throw _privateConstructorUsedError;

  /// Serializes this InitiatePaymentResponseDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InitiatePaymentResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InitiatePaymentResponseDtoCopyWith<InitiatePaymentResponseDto>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InitiatePaymentResponseDtoCopyWith<$Res> {
  factory $InitiatePaymentResponseDtoCopyWith(InitiatePaymentResponseDto value,
          $Res Function(InitiatePaymentResponseDto) then) =
      _$InitiatePaymentResponseDtoCopyWithImpl<$Res,
          InitiatePaymentResponseDto>;
  @useResult
  $Res call({String transactionId, String status, String? depositId});
}

/// @nodoc
class _$InitiatePaymentResponseDtoCopyWithImpl<$Res,
        $Val extends InitiatePaymentResponseDto>
    implements $InitiatePaymentResponseDtoCopyWith<$Res> {
  _$InitiatePaymentResponseDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InitiatePaymentResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? status = null,
    Object? depositId = freezed,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      depositId: freezed == depositId
          ? _value.depositId
          : depositId // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$InitiatePaymentResponseDtoImplCopyWith<$Res>
    implements $InitiatePaymentResponseDtoCopyWith<$Res> {
  factory _$$InitiatePaymentResponseDtoImplCopyWith(
          _$InitiatePaymentResponseDtoImpl value,
          $Res Function(_$InitiatePaymentResponseDtoImpl) then) =
      __$$InitiatePaymentResponseDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId, String status, String? depositId});
}

/// @nodoc
class __$$InitiatePaymentResponseDtoImplCopyWithImpl<$Res>
    extends _$InitiatePaymentResponseDtoCopyWithImpl<$Res,
        _$InitiatePaymentResponseDtoImpl>
    implements _$$InitiatePaymentResponseDtoImplCopyWith<$Res> {
  __$$InitiatePaymentResponseDtoImplCopyWithImpl(
      _$InitiatePaymentResponseDtoImpl _value,
      $Res Function(_$InitiatePaymentResponseDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of InitiatePaymentResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? status = null,
    Object? depositId = freezed,
  }) {
    return _then(_$InitiatePaymentResponseDtoImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      depositId: freezed == depositId
          ? _value.depositId
          : depositId // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$InitiatePaymentResponseDtoImpl implements _InitiatePaymentResponseDto {
  const _$InitiatePaymentResponseDtoImpl(
      {required this.transactionId, required this.status, this.depositId});

  factory _$InitiatePaymentResponseDtoImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$InitiatePaymentResponseDtoImplFromJson(json);

  @override
  final String transactionId;
  @override
  final String status;
  @override
  final String? depositId;

  @override
  String toString() {
    return 'InitiatePaymentResponseDto(transactionId: $transactionId, status: $status, depositId: $depositId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InitiatePaymentResponseDtoImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.depositId, depositId) ||
                other.depositId == depositId));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, transactionId, status, depositId);

  /// Create a copy of InitiatePaymentResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InitiatePaymentResponseDtoImplCopyWith<_$InitiatePaymentResponseDtoImpl>
      get copyWith => __$$InitiatePaymentResponseDtoImplCopyWithImpl<
          _$InitiatePaymentResponseDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$InitiatePaymentResponseDtoImplToJson(
      this,
    );
  }
}

abstract class _InitiatePaymentResponseDto
    implements InitiatePaymentResponseDto {
  const factory _InitiatePaymentResponseDto(
      {required final String transactionId,
      required final String status,
      final String? depositId}) = _$InitiatePaymentResponseDtoImpl;

  factory _InitiatePaymentResponseDto.fromJson(Map<String, dynamic> json) =
      _$InitiatePaymentResponseDtoImpl.fromJson;

  @override
  String get transactionId;
  @override
  String get status;
  @override
  String? get depositId;

  /// Create a copy of InitiatePaymentResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InitiatePaymentResponseDtoImplCopyWith<_$InitiatePaymentResponseDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

RefundRequestDto _$RefundRequestDtoFromJson(Map<String, dynamic> json) {
  return _RefundRequestDto.fromJson(json);
}

/// @nodoc
mixin _$RefundRequestDto {
  String get transactionId => throw _privateConstructorUsedError;
  String get reason => throw _privateConstructorUsedError;

  /// Serializes this RefundRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RefundRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RefundRequestDtoCopyWith<RefundRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RefundRequestDtoCopyWith<$Res> {
  factory $RefundRequestDtoCopyWith(
          RefundRequestDto value, $Res Function(RefundRequestDto) then) =
      _$RefundRequestDtoCopyWithImpl<$Res, RefundRequestDto>;
  @useResult
  $Res call({String transactionId, String reason});
}

/// @nodoc
class _$RefundRequestDtoCopyWithImpl<$Res, $Val extends RefundRequestDto>
    implements $RefundRequestDtoCopyWith<$Res> {
  _$RefundRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RefundRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? reason = null,
  }) {
    return _then(_value.copyWith(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      reason: null == reason
          ? _value.reason
          : reason // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RefundRequestDtoImplCopyWith<$Res>
    implements $RefundRequestDtoCopyWith<$Res> {
  factory _$$RefundRequestDtoImplCopyWith(_$RefundRequestDtoImpl value,
          $Res Function(_$RefundRequestDtoImpl) then) =
      __$$RefundRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String transactionId, String reason});
}

/// @nodoc
class __$$RefundRequestDtoImplCopyWithImpl<$Res>
    extends _$RefundRequestDtoCopyWithImpl<$Res, _$RefundRequestDtoImpl>
    implements _$$RefundRequestDtoImplCopyWith<$Res> {
  __$$RefundRequestDtoImplCopyWithImpl(_$RefundRequestDtoImpl _value,
      $Res Function(_$RefundRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of RefundRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? transactionId = null,
    Object? reason = null,
  }) {
    return _then(_$RefundRequestDtoImpl(
      transactionId: null == transactionId
          ? _value.transactionId
          : transactionId // ignore: cast_nullable_to_non_nullable
              as String,
      reason: null == reason
          ? _value.reason
          : reason // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RefundRequestDtoImpl implements _RefundRequestDto {
  const _$RefundRequestDtoImpl(
      {required this.transactionId, required this.reason});

  factory _$RefundRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$RefundRequestDtoImplFromJson(json);

  @override
  final String transactionId;
  @override
  final String reason;

  @override
  String toString() {
    return 'RefundRequestDto(transactionId: $transactionId, reason: $reason)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RefundRequestDtoImpl &&
            (identical(other.transactionId, transactionId) ||
                other.transactionId == transactionId) &&
            (identical(other.reason, reason) || other.reason == reason));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, transactionId, reason);

  /// Create a copy of RefundRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RefundRequestDtoImplCopyWith<_$RefundRequestDtoImpl> get copyWith =>
      __$$RefundRequestDtoImplCopyWithImpl<_$RefundRequestDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RefundRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _RefundRequestDto implements RefundRequestDto {
  const factory _RefundRequestDto(
      {required final String transactionId,
      required final String reason}) = _$RefundRequestDtoImpl;

  factory _RefundRequestDto.fromJson(Map<String, dynamic> json) =
      _$RefundRequestDtoImpl.fromJson;

  @override
  String get transactionId;
  @override
  String get reason;

  /// Create a copy of RefundRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RefundRequestDtoImplCopyWith<_$RefundRequestDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
