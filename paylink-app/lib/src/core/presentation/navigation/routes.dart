class Routes {
  Routes._();

  // Root
  static const welcome = '/';

  // Merchant Auth
  static const merchantLogin = '/merchant/login';
  static const merchantRegister = '/merchant/register';

  // Merchant Shell
  static const merchantDashboard = '/merchant/dashboard';
  static const merchantLinks = '/merchant/links';
  static const merchantLinkDetail = '/merchant/links/:id';
  static const merchantCreateLink = '/merchant/links/create';
  static const merchantBulkSend = '/merchant/bulk-send';
  static const merchantTransactions = '/merchant/transactions';
  static const merchantTransactionDetail = '/merchant/transactions/:id';
  static const merchantAnalytics = '/merchant/analytics';

  // Payer Auth
  static const payerRegister = '/payer/register';
  static const payerOtp = '/payer/otp';

  // Payer Shell
  static const payerHome = '/payer/home';
  static const payerQrScanner = '/payer/scan';
  static const payerPaymentConfirm = '/payer/pay/:slug';
  static const payerHistory = '/payer/history';
  static const payerProfile = '/payer/profile';
}
