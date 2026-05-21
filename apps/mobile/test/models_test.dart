import 'package:flutter_test/flutter_test.dart';
import 'package:computicket_mobile/api/models.dart';

void main() {
  group('EventSummary.fromJson', () {
    test('parses the full event detail shape', () {
      final j = <String, dynamic>{
        'id': 'evt_1',
        'slug': 'test-event',
        'title': 'Test Event',
        'venue': 'Test Venue',
        'city': 'Lagos',
        'startsAt': '2026-06-01T18:00:00.000Z',
        'endsAt': '2026-06-01T22:00:00.000Z',
        'coverUrl': null,
        'description': 'Lorem',
        'organizer': {'slug': 'org-1', 'name': 'Org One'},
        'ticketTypes': [
          {
            'id': 'tt_1',
            'name': 'Regular',
            'priceKobo': 500000,
            'capacity': 100,
            'sold': 10,
          },
          {
            'id': 'tt_2',
            'name': 'VIP',
            'priceKobo': 2000000,
            'capacity': 20,
            'sold': 0,
          },
        ],
      };
      final e = EventSummary.fromJson(j);
      expect(e.title, 'Test Event');
      expect(e.organizer.name, 'Org One');
      expect(e.ticketTypes.length, 2);
      expect(e.minPriceKobo, 500000);
      expect(e.startsAt.toUtc().hour, 18);
    });
  });

  group('OrderRow.fromJson', () {
    test('parses paid order with one ticket', () {
      final o = OrderRow.fromJson(<String, dynamic>{
        'id': 'ord_1',
        'status': 'PAID',
        'totalKobo': 1500000,
        'paystackRef': 'ref_1',
        'paidAt': '2026-05-01T12:00:00.000Z',
        'createdAt': '2026-05-01T11:55:00.000Z',
        'event': {
          'slug': 's',
          'title': 't',
          'venue': 'v',
          'city': 'c',
          'startsAt': '2026-06-01T18:00:00.000Z',
        },
        'tickets': [
          {'id': 'tk_1', 'code': 'TKT-ABCDEF12345', 'status': 'ISSUED'},
        ],
      });
      expect(o.status, 'PAID');
      expect(o.tickets.single.code, startsWith('TKT-'));
    });
  });
}
