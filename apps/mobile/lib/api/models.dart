/// Plain Dart models mirroring the JSON shapes the API returns.
/// Hand-written rather than codegen'd because the surface is small
/// and the shapes are stable.
library;

class Organizer {
  final String slug;
  final String name;
  Organizer({required this.slug, required this.name});
  factory Organizer.fromJson(Map<String, dynamic> j) =>
      Organizer(slug: j['slug'] as String, name: j['name'] as String);
}

class TicketType {
  final String id;
  final String name;
  final int priceKobo;
  final int capacity;
  final int sold;
  TicketType({
    required this.id,
    required this.name,
    required this.priceKobo,
    required this.capacity,
    required this.sold,
  });
  factory TicketType.fromJson(Map<String, dynamic> j) => TicketType(
        id: j['id'] as String,
        name: j['name'] as String,
        priceKobo: j['priceKobo'] as int,
        capacity: j['capacity'] as int,
        sold: j['sold'] as int,
      );
}

class EventSummary {
  final String id;
  final String slug;
  final String title;
  final String venue;
  final String city;
  final DateTime startsAt;
  final DateTime endsAt;
  final String? coverUrl;
  final Organizer organizer;
  final List<TicketType> ticketTypes;
  final String? description;

  EventSummary({
    required this.id,
    required this.slug,
    required this.title,
    required this.venue,
    required this.city,
    required this.startsAt,
    required this.endsAt,
    required this.organizer,
    required this.ticketTypes,
    this.coverUrl,
    this.description,
  });

  int get minPriceKobo => ticketTypes.isEmpty
      ? 0
      : ticketTypes.map((t) => t.priceKobo).reduce((a, b) => a < b ? a : b);

  factory EventSummary.fromJson(Map<String, dynamic> j) => EventSummary(
        id: j['id'] as String,
        slug: j['slug'] as String,
        title: j['title'] as String,
        venue: j['venue'] as String,
        city: j['city'] as String,
        startsAt: DateTime.parse(j['startsAt'] as String),
        endsAt: DateTime.parse(j['endsAt'] as String),
        coverUrl: j['coverUrl'] as String?,
        description: j['description'] as String?,
        organizer: Organizer.fromJson(j['organizer'] as Map<String, dynamic>),
        ticketTypes: (j['ticketTypes'] as List<dynamic>)
            .map((t) => TicketType.fromJson(t as Map<String, dynamic>))
            .toList(),
      );
}

class AuthSession {
  final String token;
  final String userId;
  final String email;
  final String? name;
  AuthSession({
    required this.token,
    required this.userId,
    required this.email,
    this.name,
  });
  factory AuthSession.fromJson(Map<String, dynamic> j) {
    final user = j['user'] as Map<String, dynamic>;
    return AuthSession(
      token: j['token'] as String,
      userId: user['id'] as String,
      email: user['email'] as String,
      name: user['name'] as String?,
    );
  }
}

/// Result of POST /v1/auth/signin — either a real session or a 2FA challenge.
sealed class SigninResult {}

class SigninSuccess extends SigninResult {
  final AuthSession session;
  SigninSuccess(this.session);
}

class Signin2FAChallenge extends SigninResult {
  final String challengeToken;
  Signin2FAChallenge(this.challengeToken);
}

class TicketRow {
  final String id;
  final String code;
  final String status;
  TicketRow({required this.id, required this.code, required this.status});
  factory TicketRow.fromJson(Map<String, dynamic> j) => TicketRow(
        id: j['id'] as String,
        code: j['code'] as String,
        status: j['status'] as String,
      );
}

class OrderRow {
  final String id;
  final String status;
  final int totalKobo;
  final String paystackRef;
  final DateTime? paidAt;
  final DateTime createdAt;
  final EventStub event;
  final List<TicketRow> tickets;

  OrderRow({
    required this.id,
    required this.status,
    required this.totalKobo,
    required this.paystackRef,
    required this.createdAt,
    required this.event,
    required this.tickets,
    this.paidAt,
  });

  factory OrderRow.fromJson(Map<String, dynamic> j) => OrderRow(
        id: j['id'] as String,
        status: j['status'] as String,
        totalKobo: j['totalKobo'] as int,
        paystackRef: j['paystackRef'] as String,
        paidAt: j['paidAt'] == null
            ? null
            : DateTime.parse(j['paidAt'] as String),
        createdAt: DateTime.parse(j['createdAt'] as String),
        event: EventStub.fromJson(j['event'] as Map<String, dynamic>),
        tickets: (j['tickets'] as List<dynamic>)
            .map((t) => TicketRow.fromJson(t as Map<String, dynamic>))
            .toList(),
      );
}

class EventStub {
  final String slug;
  final String title;
  final String venue;
  final String city;
  final DateTime startsAt;
  EventStub({
    required this.slug,
    required this.title,
    required this.venue,
    required this.city,
    required this.startsAt,
  });
  factory EventStub.fromJson(Map<String, dynamic> j) => EventStub(
        slug: j['slug'] as String,
        title: j['title'] as String,
        venue: j['venue'] as String,
        city: j['city'] as String,
        startsAt: DateTime.parse(j['startsAt'] as String),
      );
}

class WalletTransaction {
  final String id;
  final int amountKobo;
  final String type;
  final int balanceAfterKobo;
  final String? note;
  final DateTime createdAt;
  WalletTransaction({
    required this.id,
    required this.amountKobo,
    required this.type,
    required this.balanceAfterKobo,
    required this.createdAt,
    this.note,
  });
  factory WalletTransaction.fromJson(Map<String, dynamic> j) => WalletTransaction(
        id: j['id'] as String,
        amountKobo: j['amountKobo'] as int,
        type: j['type'] as String,
        balanceAfterKobo: j['balanceAfterKobo'] as int,
        note: j['note'] as String?,
        createdAt: DateTime.parse(j['createdAt'] as String),
      );
}

class WalletOverview {
  final int balanceKobo;
  final List<WalletTransaction> transactions;
  WalletOverview({required this.balanceKobo, required this.transactions});
  factory WalletOverview.fromJson(Map<String, dynamic> j) => WalletOverview(
        balanceKobo: j['balanceKobo'] as int,
        transactions: (j['transactions'] as List<dynamic>)
            .map((t) => WalletTransaction.fromJson(t as Map<String, dynamic>))
            .toList(),
      );
}

class TopUpResponse {
  final String authorizationUrl;
  final String paystackRef;
  final int amountKobo;
  TopUpResponse({
    required this.authorizationUrl,
    required this.paystackRef,
    required this.amountKobo,
  });
  factory TopUpResponse.fromJson(Map<String, dynamic> j) {
    final paystack = j['paystack'] as Map<String, dynamic>;
    final topUp = j['topUp'] as Map<String, dynamic>;
    return TopUpResponse(
      authorizationUrl: paystack['authorizationUrl'] as String,
      paystackRef: paystack['reference'] as String,
      amountKobo: topUp['amountKobo'] as int,
    );
  }
}

class ScanResult {
  final bool ok;
  final String? reason; // already_scanned | voided
  final String code;
  final String status;
  final String? scannedAt;
  final String ticketTypeName;
  final String eventTitle;
  ScanResult({
    required this.ok,
    required this.code,
    required this.status,
    required this.ticketTypeName,
    required this.eventTitle,
    this.reason,
    this.scannedAt,
  });
  factory ScanResult.fromJson(Map<String, dynamic> j) {
    final t = j['ticket'] as Map<String, dynamic>;
    return ScanResult(
      ok: j['ok'] as bool,
      reason: j['reason'] as String?,
      code: t['code'] as String,
      status: t['status'] as String,
      scannedAt: t['scannedAt'] as String?,
      ticketTypeName: t['ticketTypeName'] as String,
      eventTitle: t['eventTitle'] as String,
    );
  }
}

class Seat {
  final String id;
  final String row;
  final String label;
  final String status; // AVAILABLE | HELD | SOLD
  Seat({required this.id, required this.row, required this.label, required this.status});
  factory Seat.fromJson(Map<String, dynamic> j) => Seat(
        id: j['id'] as String,
        row: j['row'] as String,
        label: j['label'] as String,
        status: j['status'] as String,
      );
}

class DashboardEventRow {
  final String id;
  final String slug;
  final String title;
  final String city;
  final String status;
  final int capacity;
  final int sold;
  final int held;
  final int revenueKobo;
  final int paidOrders;
  DashboardEventRow({
    required this.id,
    required this.slug,
    required this.title,
    required this.city,
    required this.status,
    required this.capacity,
    required this.sold,
    required this.held,
    required this.revenueKobo,
    required this.paidOrders,
  });
  factory DashboardEventRow.fromJson(Map<String, dynamic> j) => DashboardEventRow(
        id: j['id'] as String,
        slug: j['slug'] as String,
        title: j['title'] as String,
        city: j['city'] as String,
        status: j['status'] as String,
        capacity: j['capacity'] as int,
        sold: j['sold'] as int,
        held: j['held'] as int,
        revenueKobo: j['revenueKobo'] as int,
        paidOrders: j['paidOrders'] as int,
      );
}

class DashboardOverview {
  final String organizerSlug;
  final String organizerName;
  final List<DashboardEventRow> events;
  DashboardOverview({
    required this.organizerSlug,
    required this.organizerName,
    required this.events,
  });
  factory DashboardOverview.fromJson(Map<String, dynamic> j) {
    final organizer = j['organizer'] as Map<String, dynamic>;
    return DashboardOverview(
      organizerSlug: organizer['slug'] as String,
      organizerName: organizer['name'] as String,
      events: (j['events'] as List<dynamic>)
          .map((e) => DashboardEventRow.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Membership {
  final String role;
  final String organizerSlug;
  final String organizerName;
  Membership({required this.role, required this.organizerSlug, required this.organizerName});
  factory Membership.fromJson(Map<String, dynamic> j) {
    final org = j['organizer'] as Map<String, dynamic>;
    return Membership(
      role: j['role'] as String,
      organizerSlug: org['slug'] as String,
      organizerName: org['name'] as String,
    );
  }
}

class CreateOrderResponse {
  final String orderId;
  final String paystackRef;
  final int totalKobo;
  final String authorizationUrl;
  CreateOrderResponse({
    required this.orderId,
    required this.paystackRef,
    required this.totalKobo,
    required this.authorizationUrl,
  });
  factory CreateOrderResponse.fromJson(Map<String, dynamic> j) {
    final order = j['order'] as Map<String, dynamic>;
    final paystack = j['paystack'] as Map<String, dynamic>;
    return CreateOrderResponse(
      orderId: order['id'] as String,
      paystackRef: order['paystackRef'] as String,
      totalKobo: order['totalKobo'] as int,
      authorizationUrl: paystack['authorizationUrl'] as String,
    );
  }
}
