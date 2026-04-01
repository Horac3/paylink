// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'auth_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MerchantRegisterRequestDto _$MerchantRegisterRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _MerchantRegisterRequestDto.fromJson(json);
}

/// @nodoc
mixin _$MerchantRegisterRequestDto {
  String get businessName => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get password => throw _privateConstructorUsedError;
  String get msisdn => throw _privateConstructorUsedError;

  /// Serializes this MerchantRegisterRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MerchantRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MerchantRegisterRequestDtoCopyWith<MerchantRegisterRequestDto>
      get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MerchantRegisterRequestDtoCopyWith<$Res> {
  factory $MerchantRegisterRequestDtoCopyWith(MerchantRegisterRequestDto value,
          $Res Function(MerchantRegisterRequestDto) then) =
      _$MerchantRegisterRequestDtoCopyWithImpl<$Res,
          MerchantRegisterRequestDto>;
  @useResult
  $Res call(
      {String businessName, String email, String password, String msisdn});
}

/// @nodoc
class _$MerchantRegisterRequestDtoCopyWithImpl<$Res,
        $Val extends MerchantRegisterRequestDto>
    implements $MerchantRegisterRequestDtoCopyWith<$Res> {
  _$MerchantRegisterRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MerchantRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? businessName = null,
    Object? email = null,
    Object? password = null,
    Object? msisdn = null,
  }) {
    return _then(_value.copyWith(
      businessName: null == businessName
          ? _value.businessName
          : businessName // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MerchantRegisterRequestDtoImplCopyWith<$Res>
    implements $MerchantRegisterRequestDtoCopyWith<$Res> {
  factory _$$MerchantRegisterRequestDtoImplCopyWith(
          _$MerchantRegisterRequestDtoImpl value,
          $Res Function(_$MerchantRegisterRequestDtoImpl) then) =
      __$$MerchantRegisterRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String businessName, String email, String password, String msisdn});
}

/// @nodoc
class __$$MerchantRegisterRequestDtoImplCopyWithImpl<$Res>
    extends _$MerchantRegisterRequestDtoCopyWithImpl<$Res,
        _$MerchantRegisterRequestDtoImpl>
    implements _$$MerchantRegisterRequestDtoImplCopyWith<$Res> {
  __$$MerchantRegisterRequestDtoImplCopyWithImpl(
      _$MerchantRegisterRequestDtoImpl _value,
      $Res Function(_$MerchantRegisterRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of MerchantRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? businessName = null,
    Object? email = null,
    Object? password = null,
    Object? msisdn = null,
  }) {
    return _then(_$MerchantRegisterRequestDtoImpl(
      businessName: null == businessName
          ? _value.businessName
          : businessName // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MerchantRegisterRequestDtoImpl implements _MerchantRegisterRequestDto {
  const _$MerchantRegisterRequestDtoImpl(
      {required this.businessName,
      required this.email,
      required this.password,
      required this.msisdn});

  factory _$MerchantRegisterRequestDtoImpl.fromJson(
          Map<String, dynamic> json) =>
      _$$MerchantRegisterRequestDtoImplFromJson(json);

  @override
  final String businessName;
  @override
  final String email;
  @override
  final String password;
  @override
  final String msisdn;

  @override
  String toString() {
    return 'MerchantRegisterRequestDto(businessName: $businessName, email: $email, password: $password, msisdn: $msisdn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MerchantRegisterRequestDtoImpl &&
            (identical(other.businessName, businessName) ||
                other.businessName == businessName) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.password, password) ||
                other.password == password) &&
            (identical(other.msisdn, msisdn) || other.msisdn == msisdn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, businessName, email, password, msisdn);

  /// Create a copy of MerchantRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MerchantRegisterRequestDtoImplCopyWith<_$MerchantRegisterRequestDtoImpl>
      get copyWith => __$$MerchantRegisterRequestDtoImplCopyWithImpl<
          _$MerchantRegisterRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MerchantRegisterRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _MerchantRegisterRequestDto
    implements MerchantRegisterRequestDto {
  const factory _MerchantRegisterRequestDto(
      {required final String businessName,
      required final String email,
      required final String password,
      required final String msisdn}) = _$MerchantRegisterRequestDtoImpl;

  factory _MerchantRegisterRequestDto.fromJson(Map<String, dynamic> json) =
      _$MerchantRegisterRequestDtoImpl.fromJson;

  @override
  String get businessName;
  @override
  String get email;
  @override
  String get password;
  @override
  String get msisdn;

  /// Create a copy of MerchantRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MerchantRegisterRequestDtoImplCopyWith<_$MerchantRegisterRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

MerchantLoginRequestDto _$MerchantLoginRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _MerchantLoginRequestDto.fromJson(json);
}

/// @nodoc
mixin _$MerchantLoginRequestDto {
  String get email => throw _privateConstructorUsedError;
  String get password => throw _privateConstructorUsedError;

  /// Serializes this MerchantLoginRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MerchantLoginRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MerchantLoginRequestDtoCopyWith<MerchantLoginRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MerchantLoginRequestDtoCopyWith<$Res> {
  factory $MerchantLoginRequestDtoCopyWith(MerchantLoginRequestDto value,
          $Res Function(MerchantLoginRequestDto) then) =
      _$MerchantLoginRequestDtoCopyWithImpl<$Res, MerchantLoginRequestDto>;
  @useResult
  $Res call({String email, String password});
}

/// @nodoc
class _$MerchantLoginRequestDtoCopyWithImpl<$Res,
        $Val extends MerchantLoginRequestDto>
    implements $MerchantLoginRequestDtoCopyWith<$Res> {
  _$MerchantLoginRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MerchantLoginRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? password = null,
  }) {
    return _then(_value.copyWith(
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MerchantLoginRequestDtoImplCopyWith<$Res>
    implements $MerchantLoginRequestDtoCopyWith<$Res> {
  factory _$$MerchantLoginRequestDtoImplCopyWith(
          _$MerchantLoginRequestDtoImpl value,
          $Res Function(_$MerchantLoginRequestDtoImpl) then) =
      __$$MerchantLoginRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String email, String password});
}

/// @nodoc
class __$$MerchantLoginRequestDtoImplCopyWithImpl<$Res>
    extends _$MerchantLoginRequestDtoCopyWithImpl<$Res,
        _$MerchantLoginRequestDtoImpl>
    implements _$$MerchantLoginRequestDtoImplCopyWith<$Res> {
  __$$MerchantLoginRequestDtoImplCopyWithImpl(
      _$MerchantLoginRequestDtoImpl _value,
      $Res Function(_$MerchantLoginRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of MerchantLoginRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? password = null,
  }) {
    return _then(_$MerchantLoginRequestDtoImpl(
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MerchantLoginRequestDtoImpl implements _MerchantLoginRequestDto {
  const _$MerchantLoginRequestDtoImpl(
      {required this.email, required this.password});

  factory _$MerchantLoginRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$MerchantLoginRequestDtoImplFromJson(json);

  @override
  final String email;
  @override
  final String password;

  @override
  String toString() {
    return 'MerchantLoginRequestDto(email: $email, password: $password)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MerchantLoginRequestDtoImpl &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.password, password) ||
                other.password == password));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, email, password);

  /// Create a copy of MerchantLoginRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MerchantLoginRequestDtoImplCopyWith<_$MerchantLoginRequestDtoImpl>
      get copyWith => __$$MerchantLoginRequestDtoImplCopyWithImpl<
          _$MerchantLoginRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MerchantLoginRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _MerchantLoginRequestDto implements MerchantLoginRequestDto {
  const factory _MerchantLoginRequestDto(
      {required final String email,
      required final String password}) = _$MerchantLoginRequestDtoImpl;

  factory _MerchantLoginRequestDto.fromJson(Map<String, dynamic> json) =
      _$MerchantLoginRequestDtoImpl.fromJson;

  @override
  String get email;
  @override
  String get password;

  /// Create a copy of MerchantLoginRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MerchantLoginRequestDtoImplCopyWith<_$MerchantLoginRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

AuthResponseDto _$AuthResponseDtoFromJson(Map<String, dynamic> json) {
  return _AuthResponseDto.fromJson(json);
}

/// @nodoc
mixin _$AuthResponseDto {
  String get accessToken => throw _privateConstructorUsedError;
  String get refreshToken => throw _privateConstructorUsedError;
  String get merchantId => throw _privateConstructorUsedError;
  String get businessName => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;

  /// Serializes this AuthResponseDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AuthResponseDtoCopyWith<AuthResponseDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AuthResponseDtoCopyWith<$Res> {
  factory $AuthResponseDtoCopyWith(
          AuthResponseDto value, $Res Function(AuthResponseDto) then) =
      _$AuthResponseDtoCopyWithImpl<$Res, AuthResponseDto>;
  @useResult
  $Res call(
      {String accessToken,
      String refreshToken,
      String merchantId,
      String businessName,
      String email});
}

/// @nodoc
class _$AuthResponseDtoCopyWithImpl<$Res, $Val extends AuthResponseDto>
    implements $AuthResponseDtoCopyWith<$Res> {
  _$AuthResponseDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? merchantId = null,
    Object? businessName = null,
    Object? email = null,
  }) {
    return _then(_value.copyWith(
      accessToken: null == accessToken
          ? _value.accessToken
          : accessToken // ignore: cast_nullable_to_non_nullable
              as String,
      refreshToken: null == refreshToken
          ? _value.refreshToken
          : refreshToken // ignore: cast_nullable_to_non_nullable
              as String,
      merchantId: null == merchantId
          ? _value.merchantId
          : merchantId // ignore: cast_nullable_to_non_nullable
              as String,
      businessName: null == businessName
          ? _value.businessName
          : businessName // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AuthResponseDtoImplCopyWith<$Res>
    implements $AuthResponseDtoCopyWith<$Res> {
  factory _$$AuthResponseDtoImplCopyWith(_$AuthResponseDtoImpl value,
          $Res Function(_$AuthResponseDtoImpl) then) =
      __$$AuthResponseDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String accessToken,
      String refreshToken,
      String merchantId,
      String businessName,
      String email});
}

/// @nodoc
class __$$AuthResponseDtoImplCopyWithImpl<$Res>
    extends _$AuthResponseDtoCopyWithImpl<$Res, _$AuthResponseDtoImpl>
    implements _$$AuthResponseDtoImplCopyWith<$Res> {
  __$$AuthResponseDtoImplCopyWithImpl(
      _$AuthResponseDtoImpl _value, $Res Function(_$AuthResponseDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of AuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? accessToken = null,
    Object? refreshToken = null,
    Object? merchantId = null,
    Object? businessName = null,
    Object? email = null,
  }) {
    return _then(_$AuthResponseDtoImpl(
      accessToken: null == accessToken
          ? _value.accessToken
          : accessToken // ignore: cast_nullable_to_non_nullable
              as String,
      refreshToken: null == refreshToken
          ? _value.refreshToken
          : refreshToken // ignore: cast_nullable_to_non_nullable
              as String,
      merchantId: null == merchantId
          ? _value.merchantId
          : merchantId // ignore: cast_nullable_to_non_nullable
              as String,
      businessName: null == businessName
          ? _value.businessName
          : businessName // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AuthResponseDtoImpl implements _AuthResponseDto {
  const _$AuthResponseDtoImpl(
      {required this.accessToken,
      required this.refreshToken,
      required this.merchantId,
      required this.businessName,
      required this.email});

  factory _$AuthResponseDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$AuthResponseDtoImplFromJson(json);

  @override
  final String accessToken;
  @override
  final String refreshToken;
  @override
  final String merchantId;
  @override
  final String businessName;
  @override
  final String email;

  @override
  String toString() {
    return 'AuthResponseDto(accessToken: $accessToken, refreshToken: $refreshToken, merchantId: $merchantId, businessName: $businessName, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AuthResponseDtoImpl &&
            (identical(other.accessToken, accessToken) ||
                other.accessToken == accessToken) &&
            (identical(other.refreshToken, refreshToken) ||
                other.refreshToken == refreshToken) &&
            (identical(other.merchantId, merchantId) ||
                other.merchantId == merchantId) &&
            (identical(other.businessName, businessName) ||
                other.businessName == businessName) &&
            (identical(other.email, email) || other.email == email));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, accessToken, refreshToken, merchantId, businessName, email);

  /// Create a copy of AuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AuthResponseDtoImplCopyWith<_$AuthResponseDtoImpl> get copyWith =>
      __$$AuthResponseDtoImplCopyWithImpl<_$AuthResponseDtoImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AuthResponseDtoImplToJson(
      this,
    );
  }
}

abstract class _AuthResponseDto implements AuthResponseDto {
  const factory _AuthResponseDto(
      {required final String accessToken,
      required final String refreshToken,
      required final String merchantId,
      required final String businessName,
      required final String email}) = _$AuthResponseDtoImpl;

  factory _AuthResponseDto.fromJson(Map<String, dynamic> json) =
      _$AuthResponseDtoImpl.fromJson;

  @override
  String get accessToken;
  @override
  String get refreshToken;
  @override
  String get merchantId;
  @override
  String get businessName;
  @override
  String get email;

  /// Create a copy of AuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AuthResponseDtoImplCopyWith<_$AuthResponseDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PayerRegisterRequestDto _$PayerRegisterRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _PayerRegisterRequestDto.fromJson(json);
}

/// @nodoc
mixin _$PayerRegisterRequestDto {
  String get msisdn => throw _privateConstructorUsedError;

  /// Serializes this PayerRegisterRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PayerRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PayerRegisterRequestDtoCopyWith<PayerRegisterRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PayerRegisterRequestDtoCopyWith<$Res> {
  factory $PayerRegisterRequestDtoCopyWith(PayerRegisterRequestDto value,
          $Res Function(PayerRegisterRequestDto) then) =
      _$PayerRegisterRequestDtoCopyWithImpl<$Res, PayerRegisterRequestDto>;
  @useResult
  $Res call({String msisdn});
}

/// @nodoc
class _$PayerRegisterRequestDtoCopyWithImpl<$Res,
        $Val extends PayerRegisterRequestDto>
    implements $PayerRegisterRequestDtoCopyWith<$Res> {
  _$PayerRegisterRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PayerRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? msisdn = null,
  }) {
    return _then(_value.copyWith(
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PayerRegisterRequestDtoImplCopyWith<$Res>
    implements $PayerRegisterRequestDtoCopyWith<$Res> {
  factory _$$PayerRegisterRequestDtoImplCopyWith(
          _$PayerRegisterRequestDtoImpl value,
          $Res Function(_$PayerRegisterRequestDtoImpl) then) =
      __$$PayerRegisterRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String msisdn});
}

/// @nodoc
class __$$PayerRegisterRequestDtoImplCopyWithImpl<$Res>
    extends _$PayerRegisterRequestDtoCopyWithImpl<$Res,
        _$PayerRegisterRequestDtoImpl>
    implements _$$PayerRegisterRequestDtoImplCopyWith<$Res> {
  __$$PayerRegisterRequestDtoImplCopyWithImpl(
      _$PayerRegisterRequestDtoImpl _value,
      $Res Function(_$PayerRegisterRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of PayerRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? msisdn = null,
  }) {
    return _then(_$PayerRegisterRequestDtoImpl(
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PayerRegisterRequestDtoImpl implements _PayerRegisterRequestDto {
  const _$PayerRegisterRequestDtoImpl({required this.msisdn});

  factory _$PayerRegisterRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PayerRegisterRequestDtoImplFromJson(json);

  @override
  final String msisdn;

  @override
  String toString() {
    return 'PayerRegisterRequestDto(msisdn: $msisdn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PayerRegisterRequestDtoImpl &&
            (identical(other.msisdn, msisdn) || other.msisdn == msisdn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, msisdn);

  /// Create a copy of PayerRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PayerRegisterRequestDtoImplCopyWith<_$PayerRegisterRequestDtoImpl>
      get copyWith => __$$PayerRegisterRequestDtoImplCopyWithImpl<
          _$PayerRegisterRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PayerRegisterRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _PayerRegisterRequestDto implements PayerRegisterRequestDto {
  const factory _PayerRegisterRequestDto({required final String msisdn}) =
      _$PayerRegisterRequestDtoImpl;

  factory _PayerRegisterRequestDto.fromJson(Map<String, dynamic> json) =
      _$PayerRegisterRequestDtoImpl.fromJson;

  @override
  String get msisdn;

  /// Create a copy of PayerRegisterRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PayerRegisterRequestDtoImplCopyWith<_$PayerRegisterRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

PayerVerifyOtpRequestDto _$PayerVerifyOtpRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _PayerVerifyOtpRequestDto.fromJson(json);
}

/// @nodoc
mixin _$PayerVerifyOtpRequestDto {
  String get msisdn => throw _privateConstructorUsedError;
  String get otp => throw _privateConstructorUsedError;
  String get firebaseIdToken => throw _privateConstructorUsedError;

  /// Serializes this PayerVerifyOtpRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PayerVerifyOtpRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PayerVerifyOtpRequestDtoCopyWith<PayerVerifyOtpRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PayerVerifyOtpRequestDtoCopyWith<$Res> {
  factory $PayerVerifyOtpRequestDtoCopyWith(PayerVerifyOtpRequestDto value,
          $Res Function(PayerVerifyOtpRequestDto) then) =
      _$PayerVerifyOtpRequestDtoCopyWithImpl<$Res, PayerVerifyOtpRequestDto>;
  @useResult
  $Res call({String msisdn, String otp, String firebaseIdToken});
}

/// @nodoc
class _$PayerVerifyOtpRequestDtoCopyWithImpl<$Res,
        $Val extends PayerVerifyOtpRequestDto>
    implements $PayerVerifyOtpRequestDtoCopyWith<$Res> {
  _$PayerVerifyOtpRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PayerVerifyOtpRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? msisdn = null,
    Object? otp = null,
    Object? firebaseIdToken = null,
  }) {
    return _then(_value.copyWith(
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
      otp: null == otp
          ? _value.otp
          : otp // ignore: cast_nullable_to_non_nullable
              as String,
      firebaseIdToken: null == firebaseIdToken
          ? _value.firebaseIdToken
          : firebaseIdToken // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PayerVerifyOtpRequestDtoImplCopyWith<$Res>
    implements $PayerVerifyOtpRequestDtoCopyWith<$Res> {
  factory _$$PayerVerifyOtpRequestDtoImplCopyWith(
          _$PayerVerifyOtpRequestDtoImpl value,
          $Res Function(_$PayerVerifyOtpRequestDtoImpl) then) =
      __$$PayerVerifyOtpRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String msisdn, String otp, String firebaseIdToken});
}

/// @nodoc
class __$$PayerVerifyOtpRequestDtoImplCopyWithImpl<$Res>
    extends _$PayerVerifyOtpRequestDtoCopyWithImpl<$Res,
        _$PayerVerifyOtpRequestDtoImpl>
    implements _$$PayerVerifyOtpRequestDtoImplCopyWith<$Res> {
  __$$PayerVerifyOtpRequestDtoImplCopyWithImpl(
      _$PayerVerifyOtpRequestDtoImpl _value,
      $Res Function(_$PayerVerifyOtpRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of PayerVerifyOtpRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? msisdn = null,
    Object? otp = null,
    Object? firebaseIdToken = null,
  }) {
    return _then(_$PayerVerifyOtpRequestDtoImpl(
      msisdn: null == msisdn
          ? _value.msisdn
          : msisdn // ignore: cast_nullable_to_non_nullable
              as String,
      otp: null == otp
          ? _value.otp
          : otp // ignore: cast_nullable_to_non_nullable
              as String,
      firebaseIdToken: null == firebaseIdToken
          ? _value.firebaseIdToken
          : firebaseIdToken // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PayerVerifyOtpRequestDtoImpl implements _PayerVerifyOtpRequestDto {
  const _$PayerVerifyOtpRequestDtoImpl(
      {required this.msisdn, required this.otp, required this.firebaseIdToken});

  factory _$PayerVerifyOtpRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PayerVerifyOtpRequestDtoImplFromJson(json);

  @override
  final String msisdn;
  @override
  final String otp;
  @override
  final String firebaseIdToken;

  @override
  String toString() {
    return 'PayerVerifyOtpRequestDto(msisdn: $msisdn, otp: $otp, firebaseIdToken: $firebaseIdToken)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PayerVerifyOtpRequestDtoImpl &&
            (identical(other.msisdn, msisdn) || other.msisdn == msisdn) &&
            (identical(other.otp, otp) || other.otp == otp) &&
            (identical(other.firebaseIdToken, firebaseIdToken) ||
                other.firebaseIdToken == firebaseIdToken));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, msisdn, otp, firebaseIdToken);

  /// Create a copy of PayerVerifyOtpRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PayerVerifyOtpRequestDtoImplCopyWith<_$PayerVerifyOtpRequestDtoImpl>
      get copyWith => __$$PayerVerifyOtpRequestDtoImplCopyWithImpl<
          _$PayerVerifyOtpRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PayerVerifyOtpRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _PayerVerifyOtpRequestDto implements PayerVerifyOtpRequestDto {
  const factory _PayerVerifyOtpRequestDto(
      {required final String msisdn,
      required final String otp,
      required final String firebaseIdToken}) = _$PayerVerifyOtpRequestDtoImpl;

  factory _PayerVerifyOtpRequestDto.fromJson(Map<String, dynamic> json) =
      _$PayerVerifyOtpRequestDtoImpl.fromJson;

  @override
  String get msisdn;
  @override
  String get otp;
  @override
  String get firebaseIdToken;

  /// Create a copy of PayerVerifyOtpRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PayerVerifyOtpRequestDtoImplCopyWith<_$PayerVerifyOtpRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

PayerAuthResponseDto _$PayerAuthResponseDtoFromJson(Map<String, dynamic> json) {
  return _PayerAuthResponseDto.fromJson(json);
}

/// @nodoc
mixin _$PayerAuthResponseDto {
  String get payerSessionToken => throw _privateConstructorUsedError;
  String get msisdnHint => throw _privateConstructorUsedError;

  /// Serializes this PayerAuthResponseDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PayerAuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PayerAuthResponseDtoCopyWith<PayerAuthResponseDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PayerAuthResponseDtoCopyWith<$Res> {
  factory $PayerAuthResponseDtoCopyWith(PayerAuthResponseDto value,
          $Res Function(PayerAuthResponseDto) then) =
      _$PayerAuthResponseDtoCopyWithImpl<$Res, PayerAuthResponseDto>;
  @useResult
  $Res call({String payerSessionToken, String msisdnHint});
}

/// @nodoc
class _$PayerAuthResponseDtoCopyWithImpl<$Res,
        $Val extends PayerAuthResponseDto>
    implements $PayerAuthResponseDtoCopyWith<$Res> {
  _$PayerAuthResponseDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PayerAuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? payerSessionToken = null,
    Object? msisdnHint = null,
  }) {
    return _then(_value.copyWith(
      payerSessionToken: null == payerSessionToken
          ? _value.payerSessionToken
          : payerSessionToken // ignore: cast_nullable_to_non_nullable
              as String,
      msisdnHint: null == msisdnHint
          ? _value.msisdnHint
          : msisdnHint // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PayerAuthResponseDtoImplCopyWith<$Res>
    implements $PayerAuthResponseDtoCopyWith<$Res> {
  factory _$$PayerAuthResponseDtoImplCopyWith(_$PayerAuthResponseDtoImpl value,
          $Res Function(_$PayerAuthResponseDtoImpl) then) =
      __$$PayerAuthResponseDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String payerSessionToken, String msisdnHint});
}

/// @nodoc
class __$$PayerAuthResponseDtoImplCopyWithImpl<$Res>
    extends _$PayerAuthResponseDtoCopyWithImpl<$Res, _$PayerAuthResponseDtoImpl>
    implements _$$PayerAuthResponseDtoImplCopyWith<$Res> {
  __$$PayerAuthResponseDtoImplCopyWithImpl(_$PayerAuthResponseDtoImpl _value,
      $Res Function(_$PayerAuthResponseDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of PayerAuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? payerSessionToken = null,
    Object? msisdnHint = null,
  }) {
    return _then(_$PayerAuthResponseDtoImpl(
      payerSessionToken: null == payerSessionToken
          ? _value.payerSessionToken
          : payerSessionToken // ignore: cast_nullable_to_non_nullable
              as String,
      msisdnHint: null == msisdnHint
          ? _value.msisdnHint
          : msisdnHint // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PayerAuthResponseDtoImpl implements _PayerAuthResponseDto {
  const _$PayerAuthResponseDtoImpl(
      {required this.payerSessionToken, required this.msisdnHint});

  factory _$PayerAuthResponseDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PayerAuthResponseDtoImplFromJson(json);

  @override
  final String payerSessionToken;
  @override
  final String msisdnHint;

  @override
  String toString() {
    return 'PayerAuthResponseDto(payerSessionToken: $payerSessionToken, msisdnHint: $msisdnHint)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PayerAuthResponseDtoImpl &&
            (identical(other.payerSessionToken, payerSessionToken) ||
                other.payerSessionToken == payerSessionToken) &&
            (identical(other.msisdnHint, msisdnHint) ||
                other.msisdnHint == msisdnHint));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, payerSessionToken, msisdnHint);

  /// Create a copy of PayerAuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PayerAuthResponseDtoImplCopyWith<_$PayerAuthResponseDtoImpl>
      get copyWith =>
          __$$PayerAuthResponseDtoImplCopyWithImpl<_$PayerAuthResponseDtoImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PayerAuthResponseDtoImplToJson(
      this,
    );
  }
}

abstract class _PayerAuthResponseDto implements PayerAuthResponseDto {
  const factory _PayerAuthResponseDto(
      {required final String payerSessionToken,
      required final String msisdnHint}) = _$PayerAuthResponseDtoImpl;

  factory _PayerAuthResponseDto.fromJson(Map<String, dynamic> json) =
      _$PayerAuthResponseDtoImpl.fromJson;

  @override
  String get payerSessionToken;
  @override
  String get msisdnHint;

  /// Create a copy of PayerAuthResponseDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PayerAuthResponseDtoImplCopyWith<_$PayerAuthResponseDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}

RefreshTokenRequestDto _$RefreshTokenRequestDtoFromJson(
    Map<String, dynamic> json) {
  return _RefreshTokenRequestDto.fromJson(json);
}

/// @nodoc
mixin _$RefreshTokenRequestDto {
  String get refreshToken => throw _privateConstructorUsedError;

  /// Serializes this RefreshTokenRequestDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RefreshTokenRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RefreshTokenRequestDtoCopyWith<RefreshTokenRequestDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RefreshTokenRequestDtoCopyWith<$Res> {
  factory $RefreshTokenRequestDtoCopyWith(RefreshTokenRequestDto value,
          $Res Function(RefreshTokenRequestDto) then) =
      _$RefreshTokenRequestDtoCopyWithImpl<$Res, RefreshTokenRequestDto>;
  @useResult
  $Res call({String refreshToken});
}

/// @nodoc
class _$RefreshTokenRequestDtoCopyWithImpl<$Res,
        $Val extends RefreshTokenRequestDto>
    implements $RefreshTokenRequestDtoCopyWith<$Res> {
  _$RefreshTokenRequestDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RefreshTokenRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? refreshToken = null,
  }) {
    return _then(_value.copyWith(
      refreshToken: null == refreshToken
          ? _value.refreshToken
          : refreshToken // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RefreshTokenRequestDtoImplCopyWith<$Res>
    implements $RefreshTokenRequestDtoCopyWith<$Res> {
  factory _$$RefreshTokenRequestDtoImplCopyWith(
          _$RefreshTokenRequestDtoImpl value,
          $Res Function(_$RefreshTokenRequestDtoImpl) then) =
      __$$RefreshTokenRequestDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String refreshToken});
}

/// @nodoc
class __$$RefreshTokenRequestDtoImplCopyWithImpl<$Res>
    extends _$RefreshTokenRequestDtoCopyWithImpl<$Res,
        _$RefreshTokenRequestDtoImpl>
    implements _$$RefreshTokenRequestDtoImplCopyWith<$Res> {
  __$$RefreshTokenRequestDtoImplCopyWithImpl(
      _$RefreshTokenRequestDtoImpl _value,
      $Res Function(_$RefreshTokenRequestDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of RefreshTokenRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? refreshToken = null,
  }) {
    return _then(_$RefreshTokenRequestDtoImpl(
      refreshToken: null == refreshToken
          ? _value.refreshToken
          : refreshToken // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RefreshTokenRequestDtoImpl implements _RefreshTokenRequestDto {
  const _$RefreshTokenRequestDtoImpl({required this.refreshToken});

  factory _$RefreshTokenRequestDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$RefreshTokenRequestDtoImplFromJson(json);

  @override
  final String refreshToken;

  @override
  String toString() {
    return 'RefreshTokenRequestDto(refreshToken: $refreshToken)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RefreshTokenRequestDtoImpl &&
            (identical(other.refreshToken, refreshToken) ||
                other.refreshToken == refreshToken));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, refreshToken);

  /// Create a copy of RefreshTokenRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RefreshTokenRequestDtoImplCopyWith<_$RefreshTokenRequestDtoImpl>
      get copyWith => __$$RefreshTokenRequestDtoImplCopyWithImpl<
          _$RefreshTokenRequestDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RefreshTokenRequestDtoImplToJson(
      this,
    );
  }
}

abstract class _RefreshTokenRequestDto implements RefreshTokenRequestDto {
  const factory _RefreshTokenRequestDto({required final String refreshToken}) =
      _$RefreshTokenRequestDtoImpl;

  factory _RefreshTokenRequestDto.fromJson(Map<String, dynamic> json) =
      _$RefreshTokenRequestDtoImpl.fromJson;

  @override
  String get refreshToken;

  /// Create a copy of RefreshTokenRequestDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RefreshTokenRequestDtoImplCopyWith<_$RefreshTokenRequestDtoImpl>
      get copyWith => throw _privateConstructorUsedError;
}
