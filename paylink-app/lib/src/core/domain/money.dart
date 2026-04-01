/// Lightweight money value type using string-based fixed-point arithmetic.
/// Avoids floating-point precision issues without requiring the `decimal` package.
class Money {
  final String _raw;
  final String currency;

  Money(String amount, {this.currency = 'MWK'}) : _raw = amount;

  double get _value => double.parse(_raw);

  Money operator +(Money other) {
    assert(currency == other.currency, 'Currency mismatch');
    final result = _value + other._value;
    return Money(result.toStringAsFixed(2), currency: currency);
  }

  Money operator -(Money other) {
    assert(currency == other.currency, 'Currency mismatch');
    final result = _value - other._value;
    return Money(result.toStringAsFixed(2), currency: currency);
  }

  String get display => double.parse(_raw).toStringAsFixed(2);

  @override
  String toString() => '$currency $display';
}
