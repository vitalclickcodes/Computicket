import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'api/api_client.dart';
import 'router.dart';
import 'state/auth_store.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final api = ApiClient();
  final auth = AuthStore(api);
  await auth.hydrate();
  runApp(ComputicketApp(api: api, auth: auth));
}

class ComputicketApp extends StatelessWidget {
  final ApiClient api;
  final AuthStore auth;
  const ComputicketApp({super.key, required this.api, required this.auth});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>.value(value: api),
        ChangeNotifierProvider<AuthStore>.value(value: auth),
      ],
      child: MaterialApp.router(
        title: 'Computicket Nigeria',
        debugShowCheckedModeBanner: false,
        theme: buildTheme(),
        routerConfig: buildRouter(auth),
      ),
    );
  }
}
