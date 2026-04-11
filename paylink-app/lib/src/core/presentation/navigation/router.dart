import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../features/auth/presentation/pages/welcome_page.dart';
import '../../../features/auth/presentation/pages/merchant_login_page.dart';
import '../../../features/auth/presentation/pages/merchant_register_page.dart';
import '../../../features/auth/presentation/pages/payer_register_page.dart';
import '../../../features/auth/presentation/pages/payer_otp_page.dart';
import '../../../features/merchant/presentation/pages/merchant_dashboard_page.dart';
import '../../../features/merchant/presentation/pages/merchant_links_page.dart';
import '../../../features/merchant/presentation/pages/merchant_link_detail_page.dart';
import '../../../features/merchant/presentation/pages/merchant_create_link_page.dart';
import '../../../features/merchant/presentation/pages/merchant_transactions_page.dart';
import '../../../features/merchant/presentation/pages/merchant_transaction_detail_page.dart';
import '../../../features/merchant/presentation/pages/merchant_analytics_page.dart';
import '../../../features/merchant/presentation/pages/merchant_bulk_send_page.dart';
import '../../../features/payer/presentation/pages/payer_home_page.dart';
import '../../../features/payer/presentation/pages/payer_qr_scanner_page.dart';
import '../../../features/payer/presentation/pages/payer_payment_confirm_page.dart';
import '../../../features/payer/presentation/pages/payer_history_page.dart';
import '../../../features/payer/presentation/pages/payer_profile_page.dart';
import '../../data/providers/core_providers.dart';
import '../../domain/user_role.dart';
import 'routes.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final storage = ref.read(secureStorageProvider);

  return GoRouter(
    initialLocation: Routes.welcome,
    redirect: (context, state) async {
      final isAuth = await storage.isAuthenticated();
      final loc = state.matchedLocation;

      final isOnAuthPage = loc == Routes.welcome ||
          loc == Routes.merchantLogin ||
          loc == Routes.merchantRegister ||
          loc == Routes.payerRegister ||
          loc == Routes.payerOtp;

      if (!isAuth && !isOnAuthPage) return Routes.welcome;
      if (isAuth && loc == Routes.welcome) {
        final role = await storage.getUserRole();
        return role == UserRole.merchant
            ? Routes.merchantDashboard
            : Routes.payerHome;
      }
      return null;
    },
    routes: [
      GoRoute(path: Routes.welcome, builder: (_, __) => const WelcomePage()),
      GoRoute(
          path: Routes.merchantLogin,
          builder: (_, __) => const MerchantLoginPage()),
      GoRoute(
          path: Routes.merchantRegister,
          builder: (_, __) => const MerchantRegisterPage()),
      GoRoute(
          path: Routes.payerRegister,
          builder: (_, __) => const PayerRegisterPage()),
      GoRoute(
        path: Routes.payerOtp,
        builder: (_, state) => PayerOtpPage(
            msisdn: state.uri.queryParameters['msisdn'] ?? ''),
      ),

      // Merchant Shell
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            _MerchantShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.merchantDashboard,
                builder: (_, __) => const MerchantDashboardPage()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: Routes.merchantLinks,
              builder: (_, __) => const MerchantLinksPage(),
              routes: [
                GoRoute(
                    path: 'create',
                    builder: (_, __) => const MerchantCreateLinkPage()),
                GoRoute(
                  path: ':id',
                  builder: (_, state) => MerchantLinkDetailPage(
                      linkId: state.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: Routes.merchantTransactions,
              builder: (_, __) => const MerchantTransactionsPage(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (_, state) => MerchantTransactionDetailPage(
                      transactionId: state.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.merchantAnalytics,
                builder: (_, __) => const MerchantAnalyticsPage()),
          ]),
        ],
      ),

      // Payer Shell
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            _PayerShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.payerHome,
                builder: (_, __) => const PayerHomePage()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.payerQrScanner,
                builder: (_, __) => const PayerQrScannerPage()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.payerHistory,
                builder: (_, __) => const PayerHistoryPage()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: Routes.payerProfile,
                builder: (_, __) => const PayerProfilePage()),
          ]),
        ],
      ),

      // Merchant bulk send (outside shell so it can receive linkId query param)
      GoRoute(
        path: Routes.merchantBulkSend,
        builder: (_, state) => MerchantBulkSendPage(
          linkId: state.uri.queryParameters['linkId'],
        ),
      ),

      // Deep link — payer payment confirm (no shell)
      // Supports optional ?r=<recipientToken> query parameter
      GoRoute(
        path: '/payer/pay/:slug',
        builder: (_, state) => PayerPaymentConfirmPage(
          slug: state.pathParameters['slug']!,
          recipientToken: state.uri.queryParameters['r'],
        ),
      ),
    ],
  );
});

class _MerchantShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  const _MerchantShell({required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: navigationShell.goBranch,
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard),
              label: 'Dashboard'),
          NavigationDestination(
              icon: Icon(Icons.link_outlined),
              selectedIcon: Icon(Icons.link),
              label: 'Links'),
          NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long),
              label: 'Transactions'),
          NavigationDestination(
              icon: Icon(Icons.bar_chart_outlined),
              selectedIcon: Icon(Icons.bar_chart),
              label: 'Analytics'),
        ],
      ),
    );
  }
}

class _PayerShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;
  const _PayerShell({required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: navigationShell.goBranch,
        destinations: const [
          NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home),
              label: 'Home'),
          NavigationDestination(
              icon: Icon(Icons.qr_code_scanner_outlined),
              selectedIcon: Icon(Icons.qr_code_scanner),
              label: 'Scan'),
          NavigationDestination(
              icon: Icon(Icons.history_outlined),
              selectedIcon: Icon(Icons.history),
              label: 'History'),
          NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile'),
        ],
      ),
    );
  }
}
