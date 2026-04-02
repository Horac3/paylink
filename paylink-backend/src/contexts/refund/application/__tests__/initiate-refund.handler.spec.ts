import { InitiateRefundHandler } from '../commands/initiate-refund.handler';
import { InitiateRefundCommand } from '../commands/initiate-refund.command';
import { IRefundRepository } from '../../domain/ports/refund-repository.interface';
import { ITransactionRepository } from '@contexts/payment/domain/ports/transaction-repository.interface';
import { Transaction } from '@contexts/payment/domain/transaction.aggregate';
import { Money } from '@shared/domain/money.vo';
import { DomainError } from '@shared/errors/domain.error';
import { EventBus } from '@nestjs/cqrs';
import { RailRouterService } from '@contexts/payment/infrastructure/rail-router.service';

const makeTxn = (status = 'SUCCESS') =>
  Transaction.reconstitute({
    id: 'txn-1',
    linkId: 'link-1',
    merchantId: 'merch-1',
    payerAccountId: null,
    grossAmount: Money.of('1000', 'MWK'),
    feeRate: '0.02',
    feeAmount: Money.of('20', 'MWK'),
    netAmount: Money.of('980', 'MWK'),
    rail: 'PAWAPAY',
    providerCode: 'AIRTEL_MALAWI',
    externalRef: 'ext-1',
    receiptNumber: null,
    externalProviderRef: null,
    status: status as 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED',
    webhookDelivered: false,
  });

describe('InitiateRefundHandler', () => {
  const mockRefundRepo: jest.Mocked<IRefundRepository> = {
    findById: jest.fn(),
    findByExternalRef: jest.fn(),
    findByTransactionId: jest.fn(),
    findByMerchant: jest.fn(),
    save: jest.fn(),
  };
  const mockTxnRepo: jest.Mocked<ITransactionRepository> = {
    findById: jest.fn(),
    findByExternalRef: jest.fn(),
    save: jest.fn(),
  };
  const mockRailRouter = {
    getAdapter: jest.fn().mockReturnValue({
      initiateRefund: jest
        .fn()
        .mockResolvedValue({ externalRef: 'ref-ext', status: 'ACCEPTED' }),
    }),
  } as unknown as RailRouterService;
  const mockEventBus = { publish: jest.fn() } as unknown as EventBus;

  let handler: InitiateRefundHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    handler = new InitiateRefundHandler(
      mockRefundRepo,
      mockTxnRepo,
      mockRailRouter,
      mockEventBus,
    );
  });

  it('initiates refund for SUCCESS transaction', async () => {
    mockTxnRepo.findById.mockResolvedValue(makeTxn('SUCCESS'));
    mockRefundRepo.findByTransactionId.mockResolvedValue([]);
    mockRefundRepo.save.mockResolvedValue();
    const result = await handler.execute(
      new InitiateRefundCommand('txn-1', 'merch-1', '500', 'test'),
    );
    expect(result.refundId).toBeDefined();
  });

  it('throws DomainError for non-SUCCESS transaction', async () => {
    mockTxnRepo.findById.mockResolvedValue(makeTxn('PENDING'));
    await expect(
      handler.execute(
        new InitiateRefundCommand('txn-1', 'merch-1', '500', 'test'),
      ),
    ).rejects.toThrow(DomainError);
  });

  it('throws DomainError when refund amount exceeds gross', async () => {
    mockTxnRepo.findById.mockResolvedValue(makeTxn('SUCCESS'));
    mockRefundRepo.findByTransactionId.mockResolvedValue([]);
    await expect(
      handler.execute(
        new InitiateRefundCommand('txn-1', 'merch-1', '9999', 'test'),
      ),
    ).rejects.toThrow(DomainError);
  });

  it('throws DomainError when existing PENDING refund', async () => {
    const { Refund } = require('../../domain/refund.aggregate');
    const existingRefund = Refund.reconstitute({
      id: 'r1',
      transactionId: 'txn-1',
      merchantId: 'merch-1',
      depositId: 'ext-1',
      amount: Money.of('500', 'MWK'),
      currency: 'MWK',
      status: 'PENDING',
      rail: 'PAWAPAY',
      externalRef: null,
      reason: 'prev',
      resolvedAt: null,
    });
    mockTxnRepo.findById.mockResolvedValue(makeTxn('SUCCESS'));
    mockRefundRepo.findByTransactionId.mockResolvedValue([existingRefund]);
    await expect(
      handler.execute(
        new InitiateRefundCommand('txn-1', 'merch-1', '500', 'test'),
      ),
    ).rejects.toThrow(DomainError);
  });
});
