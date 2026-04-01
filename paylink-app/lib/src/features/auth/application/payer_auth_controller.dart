import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/data/dto/auth_dto.dart';
import '../../../core/data/providers/core_providers.dart';

part 'payer_auth_controller.g.dart';

@riverpod
class PayerAuthController extends _$PayerAuthController {
  @override
  AsyncValue<void> build() => const AsyncData(null);

  String? _verificationId;

  Future<bool> sendOtp({required String msisdn}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final completer = Completer<void>();
      await FirebaseAuth.instance.verifyPhoneNumber(
        phoneNumber: msisdn,
        verificationCompleted: (_) {},
        verificationFailed: (e) => completer.completeError(e),
        codeSent: (verificationId, _) {
          _verificationId = verificationId;
          completer.complete();
        },
        codeAutoRetrievalTimeout: (_) {},
      );
      await completer.future;
    });
    return state is AsyncData;
  }

  Future<bool> verifyOtp({required String msisdn, required String otp}) async {
    state = const AsyncLoading();
    final api = ref.read(paylinkApiProvider);
    final storage = ref.read(secureStorageProvider);
    state = await AsyncValue.guard(() async {
      if (_verificationId == null) throw Exception('No verification in progress');
      final credential = PhoneAuthProvider.credential(
        verificationId: _verificationId!,
        smsCode: otp,
      );
      final userCredential =
          await FirebaseAuth.instance.signInWithCredential(credential);
      final firebaseIdToken =
          await userCredential.user!.getIdToken() ?? '';
      final res = await api.payerVerifyOtp(
        PayerVerifyOtpRequestDto(
          msisdn: msisdn,
          otp: otp,
          firebaseIdToken: firebaseIdToken,
        ),
      );
      await storage.savePayerSession(
        payerSessionToken: res.payerSessionToken,
        msisdnHint: res.msisdnHint,
      );
    });
    return state is AsyncData;
  }
}
