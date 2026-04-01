import 'package:freezed_annotation/freezed_annotation.dart';
part 'auth_dto.freezed.dart';
part 'auth_dto.g.dart';

@freezed
class MerchantRegisterRequestDto with _$MerchantRegisterRequestDto {
  const factory MerchantRegisterRequestDto({
    required String businessName,
    required String email,
    required String password,
    required String msisdn,
  }) = _MerchantRegisterRequestDto;
  factory MerchantRegisterRequestDto.fromJson(Map<String, dynamic> json) =>
      _$MerchantRegisterRequestDtoFromJson(json);
}

@freezed
class MerchantLoginRequestDto with _$MerchantLoginRequestDto {
  const factory MerchantLoginRequestDto({
    required String email,
    required String password,
  }) = _MerchantLoginRequestDto;
  factory MerchantLoginRequestDto.fromJson(Map<String, dynamic> json) =>
      _$MerchantLoginRequestDtoFromJson(json);
}

@freezed
class AuthResponseDto with _$AuthResponseDto {
  const factory AuthResponseDto({
    required String accessToken,
    required String refreshToken,
    required String merchantId,
    required String businessName,
    required String email,
  }) = _AuthResponseDto;
  factory AuthResponseDto.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseDtoFromJson(json);
}

@freezed
class PayerRegisterRequestDto with _$PayerRegisterRequestDto {
  const factory PayerRegisterRequestDto({
    required String msisdn,
  }) = _PayerRegisterRequestDto;
  factory PayerRegisterRequestDto.fromJson(Map<String, dynamic> json) =>
      _$PayerRegisterRequestDtoFromJson(json);
}

@freezed
class PayerVerifyOtpRequestDto with _$PayerVerifyOtpRequestDto {
  const factory PayerVerifyOtpRequestDto({
    required String msisdn,
    required String otp,
    required String firebaseIdToken,
  }) = _PayerVerifyOtpRequestDto;
  factory PayerVerifyOtpRequestDto.fromJson(Map<String, dynamic> json) =>
      _$PayerVerifyOtpRequestDtoFromJson(json);
}

@freezed
class PayerAuthResponseDto with _$PayerAuthResponseDto {
  const factory PayerAuthResponseDto({
    required String payerSessionToken,
    required String msisdnHint,
  }) = _PayerAuthResponseDto;
  factory PayerAuthResponseDto.fromJson(Map<String, dynamic> json) =>
      _$PayerAuthResponseDtoFromJson(json);
}

@freezed
class RefreshTokenRequestDto with _$RefreshTokenRequestDto {
  const factory RefreshTokenRequestDto({
    required String refreshToken,
  }) = _RefreshTokenRequestDto;
  factory RefreshTokenRequestDto.fromJson(Map<String, dynamic> json) =>
      _$RefreshTokenRequestDtoFromJson(json);
}
