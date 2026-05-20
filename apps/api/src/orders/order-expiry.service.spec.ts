import { OrderExpiryService } from './order-expiry.service';

describe('OrderExpiryService.expire', () => {
  function makePrismaMock(orders: Array<{
    id: string;
    items: Array<{ ticketTypeId: string; quantity: number }>;
  }>) {
    const updateMany = jest.fn().mockResolvedValue({ count: 1 });
    const update = jest.fn().mockResolvedValue({});
    return {
      order: {
        findMany: jest.fn().mockResolvedValue(orders),
        updateMany,
      },
      ticketType: { update },
      $transaction: jest.fn(async (cb: (tx: unknown) => unknown) =>
        cb({ order: { updateMany }, ticketType: { update } }),
      ),
      _updateMany: updateMany,
      _update: update,
    };
  }

  it('returns 0 and does nothing when no candidates', async () => {
    const prisma = makePrismaMock([]);
    const svc = new OrderExpiryService(prisma as never);
    expect(await svc.expire(new Date())).toBe(0);
    expect(prisma._update).not.toHaveBeenCalled();
  });

  it('expires each candidate and releases held inventory once per item', async () => {
    const prisma = makePrismaMock([
      { id: 'o1', items: [{ ticketTypeId: 'tt1', quantity: 2 }, { ticketTypeId: 'tt2', quantity: 1 }] },
      { id: 'o2', items: [{ ticketTypeId: 'tt1', quantity: 1 }] },
    ]);
    const svc = new OrderExpiryService(prisma as never);
    const expired = await svc.expire(new Date());
    expect(expired).toBe(2);
    expect(prisma._updateMany).toHaveBeenCalledTimes(2);
    expect(prisma._update).toHaveBeenCalledTimes(3);
    expect(prisma._update).toHaveBeenCalledWith({
      where: { id: 'tt1' },
      data: { held: { decrement: 2 } },
    });
  });

  it('skips releases when the conditional update loses the race', async () => {
    const prisma = makePrismaMock([
      { id: 'o1', items: [{ ticketTypeId: 'tt1', quantity: 2 }] },
    ]);
    prisma._updateMany.mockResolvedValueOnce({ count: 0 });
    const svc = new OrderExpiryService(prisma as never);
    expect(await svc.expire(new Date())).toBe(0);
    expect(prisma._update).not.toHaveBeenCalled();
  });
});
