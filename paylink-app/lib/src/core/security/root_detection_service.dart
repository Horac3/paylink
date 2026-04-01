import 'dart:io';

/// Detects whether the device is rooted (Android) or jailbroken (iOS).
///
/// This is a heuristic check based on well-known indicators. It is not
/// foolproof — determined attackers can hide root/jailbreak — but it raises
/// the bar against casual misuse and satisfies app-store security policies.
///
/// The app also ships with `flutter_jailbreak_detection` (see pubspec.yaml)
/// which provides native-layer checks. This service provides the Dart-layer
/// fallback / supplement.
class RootDetectionService {
  /// Returns true if the device appears to be rooted (Android) or jailbroken (iOS).
  Future<bool> isCompromised() async {
    if (Platform.isAndroid) return _checkAndroid();
    if (Platform.isIOS) return _checkIOS();
    // Desktop / web — not a target platform, treat as uncompromised
    return false;
  }

  bool _checkAndroid() {
    // Check for the presence of common root-management binaries and APKs.
    // These paths are only accessible on rooted devices.
    const suspiciousPaths = [
      '/system/app/Superuser.apk',
      '/sbin/su',
      '/system/bin/su',
      '/system/xbin/su',
      '/data/local/xbin/su',
      '/data/local/bin/su',
      '/system/sd/xbin/su',
      '/system/bin/failsafe/su',
      '/data/local/su',
      '/su/bin/su',
    ];
    for (final path in suspiciousPaths) {
      if (File(path).existsSync()) return true;
    }
    return false;
  }

  bool _checkIOS() {
    // Check for the presence of Cydia and common jailbreak artefacts.
    const suspiciousPaths = [
      '/Applications/Cydia.app',
      '/Library/MobileSubstrate/MobileSubstrate.dylib',
      '/bin/bash',
      '/usr/sbin/sshd',
      '/etc/apt',
      '/private/var/lib/apt/',
    ];
    for (final path in suspiciousPaths) {
      if (File(path).existsSync()) return true;
    }

    // On a jailbroken device the app sandbox is broken — writing outside the
    // sandbox succeeds. On a stock device this throws a FileSystemException.
    try {
      final file = File('/private/paylink_jb_test.txt');
      file.writeAsStringSync('test');
      file.deleteSync();
      return true; // write succeeded — sandbox is broken
    } catch (_) {
      return false;
    }
  }
}
