import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'src/core/data/providers/core_providers.dart';
import 'src/core/presentation/navigation/router.dart';
import 'src/core/presentation/theme/app_theme.dart';
import 'src/core/presentation/widgets/core_widgets.dart';
import 'src/core/security/security_warning_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await Firebase.initializeApp();

  final container = ProviderContainer();

  // Block launch on rooted / jailbroken devices to protect financial data.
  final isCompromised =
      await container.read(rootDetectionServiceProvider).isCompromised();
  if (isCompromised) {
    runApp(const MaterialApp(
      home: SecurityWarningScreen(),
      debugShowCheckedModeBanner: false,
    ));
    return;
  }

  container
      .read(fcmServiceProvider)
      .setRouter(container.read(routerProvider));
  await container.read(fcmServiceProvider).initialize();
  await container.read(deepLinkServiceProvider).initialize();

  runApp(UncontrolledProviderScope(
    container: container,
    child: const PaylinkApp(),
  ));
}

class PaylinkApp extends ConsumerWidget {
  const PaylinkApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'PayLink',
      theme: AppTheme.light,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
      builder: (context, child) =>
          ConnectivityBanner(child: child ?? const SizedBox()),
    );
  }
}
