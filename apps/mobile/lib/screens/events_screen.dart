import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../api/models.dart';
import '../theme.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});
  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  final _controller = TextEditingController();
  Timer? _debounce;
  Future<List<EventSummary>>? _future;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future = context.read<ApiClient>().listEvents();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onSearchChanged(String q) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 250), () {
      setState(() {
        _query = q;
        _future = q.trim().isEmpty
            ? context.read<ApiClient>().listEvents()
            : context.read<ApiClient>().searchEvents(q);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Computicket', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: TextField(
              controller: _controller,
              onChanged: _onSearchChanged,
              textInputAction: TextInputAction.search,
              decoration: const InputDecoration(
                hintText: 'Search events, venues, cities…',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<EventSummary>>(
              future: _future,
              builder: (context, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snap.hasError) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text('Couldn\'t load events: ${snap.error}'),
                    ),
                  );
                }
                final events = snap.data ?? const <EventSummary>[];
                if (events.isEmpty) {
                  return Center(
                    child: Text(
                      _query.trim().isEmpty
                          ? 'No events yet.'
                          : 'No events match "$_query".',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  );
                }
                return ListView.separated(
                  itemCount: events.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (_, i) => _EventRow(event: events[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _EventRow extends StatelessWidget {
  final EventSummary event;
  const _EventRow({required this.event});

  @override
  Widget build(BuildContext context) {
    final df = DateFormat.yMMMEd('en_NG').add_jm();
    return ListTile(
      onTap: () => context.go('/events/${event.slug}'),
      title: Text(event.title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 4),
          Text(event.organizer.name,
              style: const TextStyle(color: brandGreen, fontSize: 12)),
          Text('${event.venue}, ${event.city}'),
          Text(df.format(event.startsAt),
              style: const TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
      trailing: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          const Text('From', style: TextStyle(color: Colors.grey, fontSize: 11)),
          Text(formatNaira(event.minPriceKobo),
              style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
      isThreeLine: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
}
