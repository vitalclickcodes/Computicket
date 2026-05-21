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
