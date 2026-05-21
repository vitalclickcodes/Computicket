import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';

class TicketDetailScreen extends StatelessWidget {
  final String code;
  const TicketDetailScreen({super.key, required this.code});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(leading: BackButton(onPressed: () => context.go('/tickets'))),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Show this at the gate',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500)),
                const SizedBox(height: 4),
                const Text('One scan only.',
                    style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 32),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: Colors.black12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  // Render the QR client-side rather than fetching the
                  // PNG from the API: keeps the code visible offline
                  // once the ticket has loaded, and saves a round trip.
                  child: QrImageView(
                    data: code,
                    size: 280,
                    backgroundColor: Colors.white,
                    errorCorrectionLevel: QrErrorCorrectLevel.M,
                  ),
                ),
                const SizedBox(height: 24),
                SelectableText(
                  code,
                  style: const TextStyle(
                      fontFamily: 'monospace', fontSize: 14, letterSpacing: 1),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
