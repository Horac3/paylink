// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MerchantRegisterRequestDtoImpl _$$MerchantRegisterRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$MerchantRegisterRequestDtoImpl(
      businessName: json['businessName'] as String,
      email: json['email'] as String,
      password: json['password'] as String,
      msisdn: json['msisdn'] as String,
    );

Map<String, dynamic> _$$MerchantRegisterRequestDtoImplToJson(
        _$MerchantRegisterRequestDtoImpl instance) =>
    <String, dynamic>{
      'businessName': instance.businessName,
      'email': instance.email,
      'password': instance.password,
      'msisdn': instance.msisdn,
    };

_$MerchantLoginRequestDtoImpl _$$MerchantLoginRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$MerchantLoginRequestDtoImpl(
      email: json['email'] as String,
      password: json['password'] as String,
    );

Map<String, dynamic> _$$MerchantLoginRequestDtoImplToJson(
        _$MerchantLoginRequestDtoImpl instance) =>
    <String, dynamic>{
      'email': instance.email,
      'password': instance.password,
    };

_$AuthResponseDtoImpl _$$AuthResponseDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$AuthResponseDtoImpl(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      merchantId: json['merchantId'] as String,
      businessName: json['businessName'] as String,
      email: json['email'] as String,
    );

Map<String, dynamic> _$$AuthResponseDtoImplToJson(
        _$AuthResponseDtoImpl instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'merchantId': instance.merchantId,
      'businessName': instance.businessName,
      'email': instance.email,
    };

_$PayerRegisterRequestDtoImpl _$$PayerRegisterRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$PayerRegisterRequestDtoImpl(
      msisdn: json['msisdn'] as String,
    );

Map<String, dynamic> _$$PayerRegisterRequestDtoImplToJson(
        _$PayerRegisterRequestDtoImpl instance) =>
    <String, dynamic>{
      'msisdn': instance.msisdn,
    };

_$PayerVerifyOtpRequestDtoImpl _$$PayerVerifyOtpRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$PayerVerifyOtpRequestDtoImpl(
      msisdn: json['msisdn'] as String,
      otp: json['otp'] as String,
      firebaseIdToken: json['firebaseIdToken'] as String,
    );

Map<String, dynamic> _$$PayerVerifyOtpRequestDtoImplToJson(
        _$PayerVerifyOtpRequestDtoImpl instance) =>
    <String, dynamic>{
      'msisdn': instance.msisdn,
      'otp': instance.otp,
      'firebaseIdToken': instance.firebaseIdToken,
    };

_$PayerAuthResponseDtoImpl _$$PayerAuthResponseDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$PayerAuthResponseDtoImpl(
      payerSessionToken: json['payerSessionToken'] as String,
      msisdnHint: json['msisdnHint'] as String,
    );

Map<String, dynamic> _$$PayerAuthResponseDtoImplToJson(
        _$PayerAuthResponseDtoImpl instance) =>
    <String, dynamic>{
      'payerSessionToken': instance.payerSessionToken,
      'msisdnHint': instance.msisdnHint,
    };

_$RefreshTokenRequestDtoImpl _$$RefreshTokenRequestDtoImplFromJson(
        Map<String, dynamic> json) =>
    _$RefreshTokenRequestDtoImpl(
      refreshToken: json['refreshToken'] as String,
    );

Map<String, dynamic> _$$RefreshTokenRequestDtoImplToJson(
        _$RefreshTokenRequestDtoImpl instance) =>
    <String, dynamic>{
      'refreshToken': instance.refreshToken,
    };
