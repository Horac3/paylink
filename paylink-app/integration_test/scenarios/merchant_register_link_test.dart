import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:paylink_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Merchant: register → create link', () {
    testWidgets('shows welcome screen on cold start', (tester) async {
      app.main();
      await tester.pumpAndSettle();
      expect(find.text("I'm a Merchant"), findsOneWidget);
    });

    testWidgets('navigates to merchant register screen', (tester) async {
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text("I'm a Merchant"));
      await tester.pumpAndSettle();
      // Login page has register link
      expect(find.text("Don't have an account?"), findsOneWidget);
    });
  });
}
