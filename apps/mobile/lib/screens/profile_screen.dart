import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../state/auth_store.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthStore>();
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        children: [
          const SizedBox(height: 24),
          Center(
            child: CircleAvatar(
              radius: 36,
              child: Text(
                (auth.name ?? auth.email ?? '?').substring(0, 1).toUpperCase(),
                style: const TextStyle(fontSize: 24),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(auth.name ?? 'Computicket member',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
          ),
          if (auth.email != null)
            Center(
              child: Text(auth.email!, style: const TextStyle(color: Colors.grey)),
            ),
          const SizedBox(height: 24),
          ListTile(
            leading: const Icon(Icons.confirmation_number_outlined),
            title: const Text('My tickets'),
            onTap: () => context.go('/tickets'),
          ),
          ListTile(
            leading: const Icon(Icons.account_balance_wallet_outlined),
            title: const Text('Wallet'),
            onTap: () => context.go('/wallet'),
          ),
          ListTile(
            leading: const Icon(Icons.event_outlined),
            title: const Text('Browse events'),
            onTap: () => context.go('/events'),
          ),
          const Divider(),
          // Always-visible: the dashboard handles its own empty state
          // when the user isn't a member of any organizer, and the
          // scanner shows a clear 403 when the API refuses.
          ListTile(
            leading: const Icon(Icons.business_outlined),
            title: const Text('Organizer dashboard'),
            subtitle: const Text('If you run events on Computicket'),
            onTap: () => context.go('/dashboard'),
          ),
          ListTile(
            leading: const Icon(Icons.qr_code_scanner_outlined),
            title: const Text('Scan tickets'),
            subtitle: const Text('For organizer staff at the gate'),
            onTap: () => context.go('/scanner'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Sign out', style: TextStyle(color: Colors.red)),
            onTap: () async {
              await auth.signOut();
              if (context.mounted) context.go('/events');
            },
          ),
        ],
      ),
    );
  }
}
