import request from 'supertest';
import { createTestApp, seedMinimal, TestContext } from './helpers';

describe('Session management (e2e)', () => {
  let ctx: TestContext;
  beforeAll(async () => { ctx = await createTestApp(); });
  afterAll(async () => { await ctx.close(); });
  beforeEach(async () => {
    await ctx.resetDb();
    await seedMinimal(ctx.prisma);
  });

  async function signupOnly(): Promise<string> {
    const { body } = await request(ctx.app.getHttpServer())
      .post('/v1/auth/signup')
      .set('user-agent', 'Test/1.0')
      .send({ email: 'user@test.ng', password: 'Password123!' })
      .expect(201);
    return body.token;
  }

  it('lists the current session and marks it as current', async () => {
    const token = await signupOnly();
    const { body } = await request(ctx.app.getHttpServer())
      .get('/v1/me/sessions')
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(body).toHaveLength(1);
    expect(body[0].current).toBe(true);
    expect(body[0].userAgent).toMatch(/Test/);
  });

  it('revoking the current session denies subsequent requests', async () => {
    const token = await signupOnly();
    const { body: list } = await request(ctx.app.getHttpServer())
      .get('/v1/me/sessions')
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    const sessionId = list[0].id;

    await request(ctx.app.getHttpServer())
      .delete(`/v1/me/sessions/${sessionId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    // Same JWT is now useless.
    await request(ctx.app.getHttpServer())
      .get('/v1/me/sessions')
      .set('authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('“log out everywhere” keeps the current session live', async () => {
    const t1 = await signupOnly();
    // Open another session for the same user (simulate a second device).
    const { body: s2 } = await request(ctx.app.getHttpServer())
      .post('/v1/auth/signin')
      .set('user-agent', 'OtherDevice/2.0')
      .send({ email: 'user@test.ng', password: 'Password123!' })
      .expect(201);
    const t2 = s2.token;

    // Both alive
    await request(ctx.app.getHttpServer()).get('/v1/me/sessions')
      .set('authorization', `Bearer ${t1}`).expect(200);
    await request(ctx.app.getHttpServer()).get('/v1/me/sessions')
      .set('authorization', `Bearer ${t2}`).expect(200);

    // From session 1, nuke everything else.
    const { body: nuke } = await request(ctx.app.getHttpServer())
      .delete('/v1/me/sessions')
      .set('authorization', `Bearer ${t1}`)
      .expect(200);
    expect(nuke.revokedCount).toBe(1);

    // t1 still works, t2 is revoked.
    await request(ctx.app.getHttpServer()).get('/v1/me/sessions')
      .set('authorization', `Bearer ${t1}`).expect(200);
    await request(ctx.app.getHttpServer()).get('/v1/me/sessions')
      .set('authorization', `Bearer ${t2}`).expect(401);
  });
});
