import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../api/models.dart';
import '../state/auth_store.dart';

/// Scans a ticket QR with the camera and POSTs the code to /v1/tickets/scan.
/// Caller must be an OrganizerMember on the event's organizer
/// (SCANNER role minimum) — otherwise the API returns 403 and we show
/// the message inline.
class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});
  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );

  ScanResult? _lastResult;
  String? _error;
  bool _busy = false;
  // Hold off re-submitting the same code for a few seconds so a single
  // hold-the-QR-up moment doesn't fire 10 requests.
  DateTime? _lastSubmittedAt;
  String? _lastSubmittedCode;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_busy) return;
    final code = capture.barcodes
        .map((b) => b.rawValue)
        .firstWhere((v) => v != null && v.startsWith('TKT-'), orElse: () => null);
    if (code == null) return;

    // Debounce identical codes within 3s.
    final now = DateTime.now();
    if (_lastSubmittedCode == code &&
        _lastSubmittedAt != null &&
        now.difference(_lastSubmittedAt!).inSeconds < 3) {
      return;
    }
    _lastSubmittedAt = now;
    _lastSubmittedCode = code;

    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final token = context.read<AuthStore>().token;
      if (token == null) throw Exception('Sign in required');
      final res = await context.read<ApiClient>().scanTicket(token: token, code: code);
      if (mounted) setState(() => _lastResult = res);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan tickets'),
        actions: [
          IconButton(
            onPressed: () => _controller.toggleTorch(),
            icon: ValueListenableBuilder<MobileScannerState>(
              valueListenable: _controller,
              builder: (_, state, __) => Icon(
                state.torchState == TorchState.on
                    ? Icons.flash_on
                    : Icons.flash_off,
              ),
            ),
          ),
          IconButton(
            onPressed: () => _controller.switchCamera(),
            icon: const Icon(Icons.cameraswitch_outlined),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: Stack(
              fit: StackFit.expand,
              children: [
                MobileScanner(controller: _controller, onDetect: _onDetect),
                // Reticle overlay
                Center(
                  child: Container(
                    width: 240,
                    height: 240,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white, width: 2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                if (_busy)
                  const Center(
                    child: CircularProgressIndicator(color: Colors.white),
                  ),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: _ResultPanel(result: _lastResult, error: _error),
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultPanel extends StatelessWidget {
  final ScanResult? result;
  final String? error;
  const _ResultPanel({required this.result, required this.error});

  @override
  Widget build(BuildContext context) {
    if (error != null) {
      return _Banner(
        color: Colors.red.shade100,
        textColor: Colors.red.shade900,
        icon: Icons.error_outline,
        title: 'Error',
        body: error!,
      );
    }
    if (result == null) {
      return const _Banner(
        color: Color(0xFFF3F4F6),
        textColor: Color(0xFF374151),
        icon: Icons.qr_code_scanner,
        title: 'Ready',
        body: 'Point the camera at a ticket QR.',
      );
    }
    final r = result!;
    if (r.ok) {
      return _Banner(
        color: Colors.green.shade100,
        textColor: Colors.green.shade900,
        icon: Icons.check_circle,
        title: 'Valid — let them in',
        body: '${r.eventTitle}\n${r.ticketTypeName}\n${r.code}',
      );
    }
    final reason = r.reason ?? 'rejected';
    final isAlready = reason == 'already_scanned';
    return _Banner(
      color: isAlready ? Colors.orange.shade100 : Colors.red.shade100,
      textColor: isAlready ? Colors.orange.shade900 : Colors.red.shade900,
      icon: isAlready ? Icons.history : Icons.block,
      title: isAlready ? 'Already scanned' : 'Refused',
      body: '${r.eventTitle}\n${r.ticketTypeName}\n${r.code}\nReason: $reason',
    );
  }
}

class _Banner extends StatelessWidget {
  final Color color;
  final Color textColor;
  final IconData icon;
  final String title;
  final String body;
  const _Banner({
    required this.color,
    required this.textColor,
    required this.icon,
    required this.title,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: textColor, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        color: textColor, fontSize: 16, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(body, style: TextStyle(color: textColor, fontFamily: 'monospace')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
