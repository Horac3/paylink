import 'package:integration_test/integration_test.dart';

import 'scenarios/merchant_register_link_test.dart' as merchant_register;
import 'scenarios/payer_otp_pay_test.dart' as payer_pay;
import 'scenarios/deep_link_cold_start_test.dart' as deep_link;
import 'scenarios/merchant_refund_test.dart' as merchant_refund;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  merchant_register.main();
  payer_pay.main();
  deep_link.main();
  merchant_refund.main();
}
