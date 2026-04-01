import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:paylink_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Payer: OTP → payment flow', () {
    testWidgets('shows Pay with PayLink button on welcome', (tester) async {
      app.main();
      await tester.pumpAndSettle();
      expect(find.text('Pay with PayLink'), findsOneWidget);
    });

    testWidgets('navigates to payer register', (tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('Pay with PayLink'));
      await tester.pumpAndSettle();
      expect(find.text('Send OTP'), findsOneWidget);
    });
  });
}
