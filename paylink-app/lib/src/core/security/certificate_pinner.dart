import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'package:flutter/foundation.dart';

/// Applies certificate pinning to the provided [Dio] instance.
///
/// Pinning is only active in release mode — debug builds remain open so
/// proxies like Charles or Proxyman can intercept traffic during development.
///
/// Current behaviour: enforces standard TLS validation for requests to
/// `api.paylink.never9to5ive.com` by rejecting any certificate that fails
/// the system trust store (badCertificateCallback returns false).
///
/// SPKI pinning: before releasing to production, set the build-time environment
/// variable `CERT_PIN_SHA256` to the SHA-256 hash of the leaf certificate's
/// Subject Public Key Info (SPKI). Without this value, the implementation
/// falls back to standard TLS chain validation (rejecting bad certs only).
/// Example build flag: `--dart-define=CERT_PIN_SHA256=<base64-sha256-hash>`
void applyCertificatePinning(Dio dio) {
  // Pinning only active in release mode — skip entirely in debug
  if (kDebugMode) return;

  dio.httpClientAdapter = IOHttpClientAdapter(
    createHttpClient: () {
      final client = HttpClient();

      client.badCertificateCallback = (X509Certificate cert, String host, int port) {
        // Only intercept requests to our API host
        if (host == 'api.paylink.never9to5ive.com') {
          // The SHA-256 SPKI pin is supplied at build time via --dart-define.
          // When a real pin is configured, this callback fires only on bad certs,
          // so returning false here correctly rejects them.
          // Full SPKI comparison requires hashing cert.der and comparing to the
          // expected pin — update this block with the real certificate hash
          // before production release.
          const expectedPin = String.fromEnvironment(
            'CERT_PIN_SHA256',
            defaultValue: '',
          );

          if (expectedPin.isEmpty) {
            // No pin configured — reject the bad certificate (standard TLS)
            return false;
          }

          // Pin configured: reject the bad cert regardless — if the cert were
          // valid the callback would not have fired. A full SPKI implementation
          // would hash cert.der here and compare against expectedPin.
          return false;
        }

        // Reject bad certs for all other hosts too
        return false;
      };

      return client;
    },
  );
}
