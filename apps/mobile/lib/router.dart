import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'screens/event_detail_screen.dart';
import 'screens/events_screen.dart';
import 'screens/my_tickets_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/shell.dart';
import 'screens/signin_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/ticket_detail_screen.dart';
import 'state/auth_store.dart';

GoRouter buildRouter(AuthStore auth) {
  final tabsKey = GlobalKey<NavigatorState>();
  return GoRouter(
    initialLocation: '/events',
    refreshListenable: auth,
    redirect: (context, state) {
      final loggedIn = auth.isSignedIn;
      final atAuth = state.matchedLocation == '/signin' ||
          state.matchedLocation == '/signup';
      final needsAuth =
          state.matchedLocation == '/tickets' || state.matchedLocation == '/profile';
      if (!loggedIn && needsAuth) return '/signin?next=${state.matchedLocation}';
      if (loggedIn && atAuth) return '/events';
      return null;
    },
    routes: [
      ShellRoute(
        navigatorKey: tabsKey,
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/events',
            builder: (_, __) => const EventsScreen(),
            routes: [
              GoRoute(
                path: ':slug',
                builder: (_, st) =>
                    EventDetailScreen(slug: st.pathParameters['slug']!),
              ),
            ],
          ),
          GoRoute(
            path: '/tickets',
            builder: (_, __) => const MyTicketsScreen(),
            routes: [
              GoRoute(
                path: ':code',
                builder: (_, st) =>
                    TicketDetailScreen(code: st.pathParameters['code']!),
              ),
            ],
          ),
          GoRoute(
            path: '/profile',
            builder: (_, __) => const ProfileScreen(),
          ),
        ],
      ),
      GoRoute(path: '/signin', builder: (_, __) => const SignInScreen()),
      GoRoute(path: '/signup', builder: (_, __) => const SignUpScreen()),
    ],
  );
}
