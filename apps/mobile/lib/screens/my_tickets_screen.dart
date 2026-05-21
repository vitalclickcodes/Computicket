import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../api/models.dart';
import '../state/auth_store.dart';
import '../theme.dart';

class MyTicketsScreen extends StatefulWidget {
  const MyTicketsScreen({super.key});
  @override
  State<MyTicketsScreen> createState() => _MyTicketsScreenState();
}

class _MyTicketsScreenState extends State<MyTicketsScreen> {
  Future<List<OrderRow>>? _future;

  @override
  void initState() {
    super.initState();
    _reload();
  }

  void _reload() {
    final auth = context.read<AuthStore>();
    final token = auth.token;
    if (token == null) return;
    setState(() {
      _future = context.read<ApiClient>().myOrders(token);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My tickets'),
        actions: [
          IconButton(onPressed: _reload, icon: const Icon(Icons.refresh)),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => _reload(),
        child: FutureBuilder<List<OrderRow>>(
          future: _future,
          builder: (context, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snap.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text('Couldn\'t load: ${snap.error}'),
                ),
              );
            }
            final orders = snap.data ?? const <OrderRow>[];
            final paid = orders.where((o) => o.status == 'PAID').toList();
            if (paid.isEmpty) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text(
                    'No paid tickets yet. Browse events from the home tab.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: paid.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (_, i) => _OrderCard(order: paid[i]),
            );
          },
        ),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final OrderRow order;
  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    final df = DateFormat.yMMMEd('en_NG').add_jm();
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(order.event.title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            Text('${order.event.venue}, ${order.event.city}',
                style: const TextStyle(color: Colors.grey)),
            Text(df.format(order.event.startsAt),
                style: const TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 12),
            Text('Paid ${formatNaira(order.totalKobo)}',
                style: const TextStyle(fontWeight: FontWeight.w500)),
            const Divider(height: 24),
            ...order.tickets.map(
              (t) => ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.confirmation_number_outlined),
                title: Text(t.code, style: const TextStyle(fontFamily: 'monospace')),
                subtitle: Text(t.status),
                trailing: TextButton(
                  onPressed: () => context.go('/tickets/${t.code}'),
                  child: const Text('Show QR'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
