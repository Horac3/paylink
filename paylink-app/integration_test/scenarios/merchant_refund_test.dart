import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:paylink_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Merchant: refund flow', () {
    testWidgets('app initializes without crash', (tester) async {
      app.main();
      await tester.pumpAndSettle();
      expect(find.text("I'm a Merchant"), findsOneWidget);
    });
  });
}
