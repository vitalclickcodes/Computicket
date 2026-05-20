import { PrismaClient, OrganizerStatus, EventStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);
  const adminHash = await bcrypt.hash('AdminPass123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@computicket.ng' },
    update: { passwordHash: adminHash, isAdmin: true },
    create: {
      email: 'admin@computicket.ng',
      name: 'Platform Admin',
      passwordHash: adminHash,
      isAdmin: true,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@livenation.ng' },
    update: { passwordHash },
    create: {
      email: 'owner@livenation.ng',
      phone: '+2348012345678',
      name: 'Adaeze Okonkwo',
      passwordHash,
    },
  });

  const organizer = await prisma.organizer.upsert({
    where: { slug: 'livenation-ng' },
    update: { status: OrganizerStatus.APPROVED, approvedAt: new Date(), approvedById: admin.id },
    create: {
      slug: 'livenation-ng',
      name: 'LiveNation Nigeria',
      status: OrganizerStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
      description: 'Premium concerts across Lagos, Abuja, and Port Harcourt.',
      members: {
        create: { userId: owner.id, role: 'OWNER' },
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'davido-timeless-tour-lagos' },
    update: {},
    create: {
      slug: 'davido-timeless-tour-lagos',
      organizerId: organizer.id,
      title: 'Davido — Timeless Tour Lagos',
      description: 'The Timeless Tour lands in Lagos for one unforgettable night.',
      venue: 'Eko Convention Centre',
      city: 'Lagos',
      startsAt: new Date('2026-08-15T19:00:00+01:00'),
      endsAt: new Date('2026-08-15T23:30:00+01:00'),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          { name: 'Regular', priceKobo: 1500000, capacity: 2000, position: 1 },
          { name: 'VIP', priceKobo: 5000000, capacity: 500, position: 2 },
          { name: 'VVIP Table (5 pax)', priceKobo: 25000000, capacity: 40, position: 3 },
        ],
      },
    },
  });

  await prisma.event.upsert({
    where: { slug: 'lagos-comedy-festival' },
    update: {},
    create: {
      slug: 'lagos-comedy-festival',
      organizerId: organizer.id,
      title: 'Lagos Comedy Festival 2026',
      description: 'A weekend of the funniest acts on the continent.',
      venue: 'Landmark Event Centre',
      city: 'Lagos',
      startsAt: new Date('2026-09-20T18:00:00+01:00'),
      endsAt: new Date('2026-09-20T22:00:00+01:00'),
      status: EventStatus.PUBLISHED,
      ticketTypes: {
        create: [
          { name: 'Standard', priceKobo: 1000000, capacity: 1500, position: 1 },
          { name: 'Front Row', priceKobo: 3500000, capacity: 200, position: 2 },
        ],
      },
    },
  });

  // A bus operator with two routes and a handful of trips over the next week.
  const busOwner = await prisma.user.upsert({
    where: { email: 'owner@gigm.ng' },
    update: { passwordHash },
    create: {
      email: 'owner@gigm.ng',
      name: 'GIG Owner',
      passwordHash,
    },
  });

  const busOp = await prisma.organizer.upsert({
    where: { slug: 'gigm-bus' },
    update: { status: OrganizerStatus.APPROVED, approvedAt: new Date(), approvedById: admin.id },
    create: {
      slug: 'gigm-bus',
      name: 'GIGM Bus',
      status: OrganizerStatus.APPROVED,
      approvedAt: new Date(),
      approvedById: admin.id,
      description: 'Inter-city luxury bus services across Nigeria.',
      members: { create: { userId: busOwner.id, role: 'OWNER' } },
    },
  });

  const lagosAbuja = await prisma.busRoute.upsert({
    where: { id: 'br_lagos_abuja' },
    update: {},
    create: {
      id: 'br_lagos_abuja',
      organizerId: busOp.id,
      fromCity: 'Lagos',
      toCity: 'Abuja',
      durationMinutes: 9 * 60,
    },
  });

  const lagosPh = await prisma.busRoute.upsert({
    where: { id: 'br_lagos_ph' },
    update: {},
    create: {
      id: 'br_lagos_ph',
      organizerId: busOp.id,
      fromCity: 'Lagos',
      toCity: 'Port Harcourt',
      durationMinutes: 10 * 60,
    },
  });

  const now = new Date();
  const trips = [
    { slug: 'gigm-lagos-abuja-morning-day-3', route: lagosAbuja, daysFromNow: 3, hour: 7 },
    { slug: 'gigm-lagos-abuja-evening-day-3', route: lagosAbuja, daysFromNow: 3, hour: 19 },
    { slug: 'gigm-lagos-ph-morning-day-5', route: lagosPh, daysFromNow: 5, hour: 7 },
  ];
  for (const t of trips) {
    const departsAt = new Date(now);
    departsAt.setUTCDate(departsAt.getUTCDate() + t.daysFromNow);
    departsAt.setUTCHours(t.hour, 0, 0, 0);
    const arrivesAt = new Date(departsAt.getTime() + t.route.durationMinutes * 60 * 1000);
    await prisma.event.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        organizerId: busOp.id,
        title: `${t.route.fromCity} → ${t.route.toCity}`,
        venue: `${t.route.fromCity} Terminal`,
        city: t.route.fromCity,
        startsAt: departsAt,
        endsAt: arrivesAt,
        status: EventStatus.PUBLISHED,
        type: 'BUS_TRIP',
        busRouteId: t.route.id,
        ticketTypes: {
          create: [
            { name: 'Standard', priceKobo: 1800000, capacity: 32, position: 1 },
            { name: 'Executive', priceKobo: 3500000, capacity: 12, position: 2 },
          ],
        },
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
