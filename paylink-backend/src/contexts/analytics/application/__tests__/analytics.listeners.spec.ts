import { AnalyticsListeners } from '../listeners/analytics.listeners';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

describe('AnalyticsListeners', () => {
  const mockPrisma = {
    linkEvent: { create: jest.fn(), findMany: jest.fn() },
    analyticsSnapshot: { upsert: jest.fn() },
    transaction: { findUnique: jest.fn() },
  } as unknown as PrismaService;

  let listeners: AnalyticsListeners;
  beforeEach(() => {
    jest.clearAllMocks();
    listeners = new AnalyticsListeners(mockPrisma);
  });

  it('calculates correct conversion rate from events', async () => {
    (mockPrisma.linkEvent.findMany as jest.Mock).mockResolvedValue([
      { type: 'PAY_STARTED' },
      { type: 'PAY_STARTED' },
      { type: 'CONVERTED' },
      { type: 'PAY_FAILED' },
    ]);
    (mockPrisma.analyticsSnapshot.upsert as jest.Mock).mockResolvedValue({});
    (mockPrisma.linkEvent.create as jest.Mock).mockResolvedValue({});

    // Call private rebuildSnapshot via a public event
    const {
      PaymentInitiatedEvent,
    } = require('@contexts/payment/domain/transaction.aggregate');
    const event = new PaymentInitiatedEvent(
      'txn-1',
      'merch-1',
      'link-1',
      '500',
      'MWK',
      'PAWAPAY',
    );
    await listeners.onPaymentInitiated(event);

    const upsertCall = (mockPrisma.analyticsSnapshot.upsert as jest.Mock).mock
      .calls[0][0];
    expect(upsertCall.create.conversionRate).toBe(0.5);
    expect(upsertCall.create.conversions).toBe(1);
    expect(upsertCall.create.failures).toBe(1);
  });

  it('handles zero payment starts gracefully', async () => {
    (mockPrisma.linkEvent.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrisma.analyticsSnapshot.upsert as jest.Mock).mockResolvedValue({});
    (mockPrisma.linkEvent.create as jest.Mock).mockResolvedValue({});

    const {
      PaymentInitiatedEvent,
    } = require('@contexts/payment/domain/transaction.aggregate');
    const event = new PaymentInitiatedEvent(
      'txn-1',
      'merch-1',
      'link-1',
      '500',
      'MWK',
      'PAWAPAY',
    );
    await listeners.onPaymentInitiated(event);

    const upsertCall = (mockPrisma.analyticsSnapshot.upsert as jest.Mock).mock
      .calls[0][0];
    expect(upsertCall.create.conversionRate).toBe(0);
  });
});
