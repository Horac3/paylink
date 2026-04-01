import { RecordSettlementHandler } from '../commands/record-settlement.handler';
import { RecordSettlementCommand } from '../commands/record-settlement.command';
import { IFeeEntryRepository } from '../../domain/ports/fee-entry-repository.interface';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

const mockRepo: jest.Mocked<IFeeEntryRepository> = {
  save: jest.fn(),
  findByTransactionId: jest.fn(),
};

const mockPrisma = {
  merchant: { findUnique: jest.fn() },
} as unknown as PrismaService;

describe('RecordSettlementHandler', () => {
  let handler: RecordSettlementHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new RecordSettlementHandler(mockRepo, mockPrisma);
  });

  it('calculates STARTER fee correctly (2%)', async () => {
    mockRepo.findByTransactionId.mockResolvedValue(null);
    mockPrisma.merchant.findUnique = jest
      .fn()
      .mockResolvedValue({ feeTier: 'STARTER' });
    mockRepo.save.mockResolvedValue();

    await handler.execute(
      new RecordSettlementCommand(
        'txn-1',
        'merch-1',
        '500.00',
        'MWK',
        'PAWAPAY',
      ),
    );

    const saved = mockRepo.save.mock.calls[0][0];
    expect(saved.feeAmount.toString()).toBe('10.00');
    expect(saved.netAmount.toString()).toBe('490.00');
    expect(saved.type).toBe('CHARGE');
  });

  it('calculates GROWTH fee correctly (1.5%)', async () => {
    mockRepo.findByTransactionId.mockResolvedValue(null);
    mockPrisma.merchant.findUnique = jest
      .fn()
      .mockResolvedValue({ feeTier: 'GROWTH' });
    mockRepo.save.mockResolvedValue();

    await handler.execute(
      new RecordSettlementCommand(
        'txn-1',
        'merch-1',
        '1000.00',
        'MWK',
        'PAWAPAY',
      ),
    );

    const saved = mockRepo.save.mock.calls[0][0];
    expect(saved.feeAmount.toString()).toBe('15.00');
    expect(saved.netAmount.toString()).toBe('985.00');
  });

  it('calculates ENTERPRISE fee correctly (1%)', async () => {
    mockRepo.findByTransactionId.mockResolvedValue(null);
    mockPrisma.merchant.findUnique = jest
      .fn()
      .mockResolvedValue({ feeTier: 'ENTERPRISE' });
    mockRepo.save.mockResolvedValue();

    await handler.execute(
      new RecordSettlementCommand(
        'txn-1',
        'merch-1',
        '2000.00',
        'MWK',
        'PAWAPAY',
      ),
    );

    const saved = mockRepo.save.mock.calls[0][0];
    expect(saved.feeAmount.toString()).toBe('20.00');
    expect(saved.netAmount.toString()).toBe('1980.00');
  });

  it('is idempotent — skips if already recorded', async () => {
    mockRepo.findByTransactionId.mockResolvedValue({
      id: 'existing',
      transactionId: 'txn-1',
      merchantId: 'merch-1',
      grossAmount: {} as any,
      feeRate: '0.02',
      feeAmount: {} as any,
      netAmount: {} as any,
      type: 'CHARGE',
      refId: null,
    });

    await handler.execute(
      new RecordSettlementCommand(
        'txn-1',
        'merch-1',
        '500.00',
        'MWK',
        'PAWAPAY',
      ),
    );
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
