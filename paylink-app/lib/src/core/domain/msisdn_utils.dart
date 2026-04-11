/// MSISDN utilities for Malawi mobile numbers.
/// Provider detection based on PawaPay confirmed prefixes.
library;

enum MobileProvider { tnm, airtel, unknown }

/// Detects the provider from a Malawi MSISDN.
/// Accepts E.164 (+265XXXXXXXXX), country-prefixed (265XXXXXXXXX),
/// or local 9-digit format (88XXXXXXX).
MobileProvider detectProvider(String msisdn) {
  final digits = msisdn.replaceAll(RegExp(r'\D'), '');
  String local = digits;
  if (local.startsWith('265')) {
    local = local.substring(3);
  } else if (local.startsWith('0')) {
    local = local.substring(1);
  }

  if (local.length < 2) return MobileProvider.unknown;

  final prefix2 = local.substring(0, 2);

  // TNM: 88x, 89x, 99x
  if (['88', '89', '99'].contains(prefix2)) return MobileProvider.tnm;

  // Airtel: 75x–78x, 97x, 98x
  if (['75', '76', '77', '78', '97', '98'].contains(prefix2)) {
    return MobileProvider.airtel;
  }

  return MobileProvider.unknown;
}

/// Returns the PawaPay provider code for [provider].
String? providerCode(MobileProvider provider) {
  return switch (provider) {
    MobileProvider.tnm => 'TNM_MWI',
    MobileProvider.airtel => 'AIRTEL_MWI',
    MobileProvider.unknown => null,
  };
}

/// Returns a human-readable label for [provider].
String providerLabel(MobileProvider provider) {
  return switch (provider) {
    MobileProvider.tnm => 'TNM Mpamba',
    MobileProvider.airtel => 'Airtel Money',
    MobileProvider.unknown => 'Unknown',
  };
}

/// Normalises a locally-entered number to E.164 (+265XXXXXXXXX).
/// Handles: 088XXXXXXX → +26588XXXXXXX, 88XXXXXXX → +26588XXXXXXX.
String toE164(String input) {
  final digits = input.replaceAll(RegExp(r'\D'), '');
  if (digits.startsWith('265')) return '+$digits';
  if (digits.startsWith('0')) return '+265${digits.substring(1)}';
  return '+265$digits';
}
