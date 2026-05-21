import request from 'supertest';
import { createTestApp, paystackSig, seedMinimal, TestContext } from './helpers';

describe('GET /v1/dashboard/organizers/:slug/analytics (e2e)', () => {
  let ctx: TestContext;
  beforeAll(async () => { ctx = await createTestApp(); });
  afterAll(async () => { await ctx.close(); });
  beforeEach(async () => { await ctx.resetDb(); });

  async function ownerToken(): Promise<string> {
    await seedMinimal(ctx.prisma);
    const { body } = await request(ctx.app.getHttpServer())
      .post('/v1/auth/signin')
      .send({ email: 'owner@test.ng', password: 'Password123!' })
      .expect(201);
    return body.token;
  }

  it('returns a zeroed overview when there are no paid orders', async () => {
    const token = await ownerToken();
    const { body } = await request(ctx.app.getHttpServer())
      .get('/v1/dashboard/organizers/test-org/analytics?days=14')
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(body.organizer.slug).toBe('test-org');
    expect(body.range.days).toBe(14);
    expect(body.totals.paidOrders).toBe(0);
    expect(body.totals.grossKobo).toBe(0);
    expect(body.totals.refundRatePct).toBe(0);
    expect(body.daily).toHaveLength(15); // generate_series is inclusive on both ends
    expect(body.ordersByHour).toHaveLength(24);
  });

  it('counts a paid order across totals + daily + hourly buckets', async () => {
    const token = await ownerToken();
    const server = ctx.app.getHttpServer();

    // Buy 1 ticket as a guest, then simulate the paystack webhook so
    // the order moves PENDING -> PAID and tickets are issued.
    const event = await ctx.prisma.event.findUniqueOrThrow({
      where: { slug: 'test-event' },
      include: { ticketTypes: true },
    });
    const ttId = event.ticketTypes[0]!.id;
    const { body: order } = await request(server).post('/v1/orders')
      .send({
        eventSlug: 'test-event',
        buyerEmail: 'buyer@test.ng',
        items: [{ ticketTypeId: ttId, quantity: 1 }],
      })
      .expect(201);
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: order.order.paystackRef, amount: order.order.totalKobo, status: 'success' },
    });
    await request(server).post('/v1/webhooks/paystack')
      .set('x-paystack-signature', paystackSig(payload))
      .set('content-type', 'application/json')
      .send(payload)
      .expect(200);

    const { body: analytics } = await request(server)
      .get('/v1/dashboard/organizers/test-org/analytics?days=30')
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(analytics.totals.paidOrders).toBe(1);
    expect(analytics.totals.ticketsSold).toBe(1);
    expect(analytics.totals.grossKobo).toBe(order.order.totalKobo);
    expect(analytics.totals.averageOrderKobo).toBe(order.order.totalKobo);

    // Today's daily bucket has the row.
    const today = analytics.daily.find(
      (d: { date: string }) => d.date === new Date().toISOString().slice(0, 10),
    );
    expect(today?.orders).toBe(1);
    expect(today?.revenueKobo).toBe(order.order.totalKobo);

    // Hour-of-day distribution is non-empty.
    const totalByHour = (analytics.ordersByHour as Array<{ orders: number }>).reduce(
      (a, h) => a + h.orders, 0,
    );
    expect(totalByHour).toBe(1);

    // The seeded event appears in topEvents with non-zero capacity.
    expect(analytics.topEvents.length).toBeGreaterThan(0);
    expect(analytics.topEvents[0].slug).toBe('test-event');
    expect(analytics.topEvents[0].sold).toBe(1);
  });

  it('refuses non-members of the organizer', async () => {
    await seedMinimal(ctx.prisma);
    const { body: outsider } = await request(ctx.app.getHttpServer())
      .post('/v1/auth/signup')
      .send({ email: 'outsider@test.ng', password: 'Password123!' })
      .expect(201);
    await request(ctx.app.getHttpServer())
      .get('/v1/dashboard/organizers/test-org/analytics')
      .set('authorization', `Bearer ${outsider.token}`)
      .expect(403);
  });
});
