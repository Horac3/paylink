import { PawaPayAdapter } from '../pawapay.adapter';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  RailRejectedError,
  RailAuthError,
  RailUnavailableError,
} from '@shared/errors/rail-errors';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedAxiosAny = axios as any;

const mockConfig = {
  getOrThrow: (key: string) => {
    if (key === 'PAWAPAY_BASE_URL') return 'https://api.sandbox.pawapay.io';
    if (key === 'PAWAPAY_API_TOKEN') return 'test-token';
    throw new Error(key);
  },
} as unknown as ConfigService;

describe('PawaPayAdapter error mapping', () => {
  let adapter: PawaPayAdapter;

  beforeEach(() => {
    mockedAxios.create = jest.fn().mockReturnValue({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      post: jest.fn(),
      get: jest.fn(),
    });
    adapter = new PawaPayAdapter(mockConfig);
  });

  const makeError = (status: number, failureCode?: string) => {
    const err = new Error('Request failed') as Error & {
      isAxiosError: boolean;
      response: {
        status: number;
        data: {
          failureReason?: { failureCode?: string; failureMessage?: string };
        };
      };
    };
    err.isAxiosError = true;
    err.response = {
      status,
      data: {
        failureReason: failureCode
          ? { failureCode, failureMessage: 'err' }
          : undefined,
      },
    };
    return err;
  };

  it('maps 401 to RailAuthError', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    (adapter as unknown as { http: { post: jest.Mock } }).http.post = jest
      .fn()
      .mockRejectedValue(makeError(401));
    await expect(
      adapter.initiateDeposit({
        depositId: 'id',
        phoneNumber: '+265999',
        amount: '100',
        currency: 'MWK',
        providerCode: 'AIRTEL_MALAWI',
        customerMessage: 'test',
      }),
    ).rejects.toBeInstanceOf(RailAuthError);
  });

  it('maps 403 to RailAuthError', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    (adapter as unknown as { http: { post: jest.Mock } }).http.post = jest
      .fn()
      .mockRejectedValue(makeError(403));
    await expect(
      adapter.initiateDeposit({
        depositId: 'id',
        phoneNumber: '+265999',
        amount: '100',
        currency: 'MWK',
        providerCode: 'AIRTEL_MALAWI',
        customerMessage: 'test',
      }),
    ).rejects.toBeInstanceOf(RailAuthError);
  });

  it('maps 500 to RailUnavailableError', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    (adapter as unknown as { http: { post: jest.Mock } }).http.post = jest
      .fn()
      .mockRejectedValue(makeError(500));
    await expect(
      adapter.initiateDeposit({
        depositId: 'id',
        phoneNumber: '+265999',
        amount: '100',
        currency: 'MWK',
        providerCode: 'AIRTEL_MALAWI',
        customerMessage: 'test',
      }),
    ).rejects.toBeInstanceOf(RailUnavailableError);
  });

  it('maps INVALID_PHONE_NUMBER to RailRejectedError', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    (adapter as unknown as { http: { post: jest.Mock } }).http.post = jest
      .fn()
      .mockRejectedValue(makeError(400, 'INVALID_PHONE_NUMBER'));
    await expect(
      adapter.initiateDeposit({
        depositId: 'id',
        phoneNumber: '+265999',
        amount: '100',
        currency: 'MWK',
        providerCode: 'AIRTEL_MALAWI',
        customerMessage: 'test',
      }),
    ).rejects.toBeInstanceOf(RailRejectedError);
  });

  it('maps AUTHENTICATION_ERROR to RailAuthError', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    (adapter as unknown as { http: { post: jest.Mock } }).http.post = jest
      .fn()
      .mockRejectedValue(makeError(200, 'AUTHENTICATION_ERROR'));
    await expect(
      adapter.initiateDeposit({
        depositId: 'id',
        phoneNumber: '+265999',
        amount: '100',
        currency: 'MWK',
        providerCode: 'AIRTEL_MALAWI',
        customerMessage: 'test',
      }),
    ).rejects.toBeInstanceOf(RailAuthError);
  });
});

describe('RailRouterService', () => {
  it('throws RailUnavailableError for unregistered rail', () => {
    const { RailRouterService } = require('../../rail-router.service');
    const router = new RailRouterService({
      railId: 'PAWAPAY',
    } as PawaPayAdapter);
    router.onModuleInit();
    expect(() => router.getAdapter('TNM')).toThrow();
  });
});

describe('SettlePaymentHandler idempotency', () => {
  it('returns early when transaction already SUCCESS', async () => {
    const {
      SettlePaymentHandler,
    } = require('../../../application/commands/settle-payment.handler');
    const { Transaction } = require('../../../domain/transaction.aggregate');
    const { Money } = require('@shared/domain/money.vo');

    const txn = Transaction.reconstitute({
      id: 'txn-1',
      linkId: 'link-1',
      merchantId: 'merch-1',
      payerAccountId: null,
      grossAmount: Money.of('100', 'MWK'),
      feeRate: '0.02',
      feeAmount: Money.of('2', 'MWK'),
      netAmount: Money.of('98', 'MWK'),
      rail: 'PAWAPAY',
      providerCode: 'AIRTEL_MALAWI',
      externalRef: 'ext-1',
      status: 'SUCCESS',
      webhookDelivered: false,
    });

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(txn),
      save: jest.fn(),
    };
    const mockEventBus = { publish: jest.fn() };
    const handler = new SettlePaymentHandler(mockRepo, mockEventBus);
    await handler.execute({ transactionId: 'txn-1', externalRef: 'ext-1' });
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
