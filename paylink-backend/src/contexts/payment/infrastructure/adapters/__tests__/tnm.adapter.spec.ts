import { TnmAdapter } from '../tnm.adapter';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  RailRejectedError,
  RailAuthError,
  RailUnavailableError,
  RailTimeoutError,
} from '@shared/errors/rail-errors';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedAxiosAny = axios as any;

const mockConfig = {
  getOrThrow: (key: string) => {
    const map: Record<string, string> = {
      TNM_BASE_URL: 'https://tnm.example.com',
      TNM_WALLET: 'test-wallet',
      TNM_PASSWORD: 'test-password',
    };
    if (map[key]) return map[key];
    throw new Error(`Missing config: ${key}`);
  },
  get: (key: string, def?: string) => def,
} as unknown as ConfigService;

function makeHttpMock() {
  return {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
  };
}

function makeAxiosError(status: number, message?: string, code?: string) {
  const err = new Error('Request failed') as Error & {
    isAxiosError: boolean;
    response: { status: number; data: { message?: string } };
    code?: string;
  };
  err.isAxiosError = true;
  err.response = { status, data: { message } };
  if (code) err.code = code;
  return err;
}

describe('TnmAdapter — token management', () => {
  let adapter: TnmAdapter;
  let httpMock: ReturnType<typeof makeHttpMock>;

  beforeEach(() => {
    httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
  });

  it('caches token on first call and reuses it', async () => {
    // Use a far-future date string in TNM format so it always parses as fresh
    const expiresAt = '2030-01-01 00:00:00';
    httpMock.post
      .mockResolvedValueOnce({ data: { data: { token: 'tok1', expires_at: expiresAt } } }) // auth
      .mockResolvedValueOnce({ data: { message: 'Request accepted and processing', data: [] } }) // invoice 1
      .mockResolvedValueOnce({ data: { message: 'Request accepted and processing', data: [] } }); // invoice 2

    await adapter.initiateDeposit({ depositId: 'id1', phoneNumber: '265881234567', amount: '100', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' });
    await adapter.initiateDeposit({ depositId: 'id2', phoneNumber: '265881234567', amount: '200', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' });

    // authenticate called once, then token reused
    const authCalls = httpMock.post.mock.calls.filter(c => c[0] === '/authenticate');
    expect(authCalls).toHaveLength(1);
    expect(httpMock.post.mock.calls).toHaveLength(3); // 1 auth + 2 invoices
  });

  it('concurrent calls await the same refresh promise — authenticate called once', async () => {
    const expiresAt = '2030-01-01 00:00:00';
    let authResolve!: (v: unknown) => void;
    const authPromise = new Promise((res) => { authResolve = res; });

    httpMock.post.mockImplementationOnce(() => authPromise); // auth hangs
    httpMock.post.mockResolvedValue({ data: { message: 'Request accepted and processing', data: [] } });

    // Start two deposits simultaneously before auth resolves
    const p1 = adapter['getToken']();
    const p2 = adapter['getToken']();

    authResolve({ data: { data: { token: 'tok-concurrent', expires_at: expiresAt } } });

    const [t1, t2] = await Promise.all([p1, p2]);
    expect(t1).toBe('tok-concurrent');
    expect(t2).toBe('tok-concurrent');
    expect(httpMock.post.mock.calls.filter(c => c[0] === '/authenticate')).toHaveLength(1);
  });
});

describe('TnmAdapter — initiateDeposit', () => {
  let adapter: TnmAdapter;
  let httpMock: ReturnType<typeof makeHttpMock>;

  beforeEach(() => {
    httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
    // Pre-cache a token
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
    (adapter as unknown as { tokenCache: unknown }).tokenCache = { token: 'pre-cached', expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  });

  it('202 accepted maps to ACCEPTED result', async () => {
    httpMock.post.mockResolvedValueOnce({ data: { message: 'Request accepted and processing', data: [] } });
    const result = await adapter.initiateDeposit({ depositId: 'uuid-1', phoneNumber: '265881234567', amount: '300', currency: 'MWK', providerCode: 'TNM', customerMessage: 'PayLink payment' });
    expect(result.status).toBe('ACCEPTED');
    expect(result.externalRef).toBe('uuid-1');
  });

  it('sends amount as number, not string', async () => {
    httpMock.post.mockResolvedValueOnce({ data: { message: 'Request accepted and processing', data: [] } });
    await adapter.initiateDeposit({ depositId: 'uuid-1', phoneNumber: '265881234567', amount: '300', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' });
    const body = httpMock.post.mock.calls[0][1];
    expect(typeof body.amount).toBe('number');
    expect(body.amount).toBe(300);
  });

  it('normalises MSISDN to E.164 with 265 prefix', async () => {
    httpMock.post.mockResolvedValueOnce({ data: { message: 'Request accepted and processing', data: [] } });
    await adapter.initiateDeposit({ depositId: 'id', phoneNumber: '0881234567', amount: '100', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' });
    const body = httpMock.post.mock.calls[0][1];
    expect(body.msisdn).toBe('2650881234567');
  });
});

describe('TnmAdapter — getDepositStatus', () => {
  let adapter: TnmAdapter;
  let httpMock: ReturnType<typeof makeHttpMock>;

  beforeEach(() => {
    httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
    (adapter as unknown as { tokenCache: unknown }).tokenCache = { token: 'tok', expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  });

  it('paid=true reversed=false → COMPLETED with receiptNumber', async () => {
    httpMock.get.mockResolvedValueOnce({ data: { data: { invoice_number: 'inv-1', paid: true, reversed: false, receipt_number: 'AGC20B5N44', settled_at: '2023-07-12 14:51:12' } } });
    const result = await adapter.getDepositStatus('inv-1');
    expect(result.status).toBe('COMPLETED');
    expect(result.receiptNumber).toBe('AGC20B5N44');
  });

  it('paid=false receipt_number=null → PENDING', async () => {
    httpMock.get.mockResolvedValueOnce({ data: { data: { invoice_number: 'inv-1', paid: false, reversed: false, receipt_number: null, settled_at: null } } });
    const result = await adapter.getDepositStatus('inv-1');
    expect(result.status).toBe('PENDING');
  });

  it('paid=true reversed=true → FAILED', async () => {
    httpMock.get.mockResolvedValueOnce({ data: { data: { invoice_number: 'inv-1', paid: true, reversed: true, receipt_number: 'AGC20B5N44', settled_at: '2023-07-12' } } });
    const result = await adapter.getDepositStatus('inv-1');
    expect(result.status).toBe('FAILED');
  });

  it('404 → throws RailRejectedError(NOT_FOUND)', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    httpMock.get.mockRejectedValueOnce(makeAxiosError(404, 'Resource not found'));
    await expect(adapter.getDepositStatus('inv-1')).rejects.toMatchObject({ failureCode: 'NOT_FOUND' });
  });
});

describe('TnmAdapter — initiateRefund', () => {
  let adapter: TnmAdapter;
  let httpMock: ReturnType<typeof makeHttpMock>;

  beforeEach(() => {
    httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
    (adapter as unknown as { tokenCache: unknown }).tokenCache = { token: 'tok', expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
  });

  it('uses receiptNumber in URL, not depositId', async () => {
    httpMock.post.mockResolvedValueOnce({ data: { data: { reversal_transaction_id: '3JO70001YR' } } });
    const result = await adapter.initiateRefund({ refundId: 'ref-1', depositId: 'txn-uuid', amount: '300', currency: 'MWK', receiptNumber: 'AGC20B5N44' });
    expect(result.status).toBe('ACCEPTED');
    expect(result.externalRef).toBe('3JO70001YR');
    const url = httpMock.post.mock.calls[0][0];
    expect(url).toContain('AGC20B5N44');
    expect(url).not.toContain('txn-uuid');
  });

  it('throws RailRejectedError when receiptNumber is missing', async () => {
    await expect(adapter.initiateRefund({ refundId: 'ref-1', depositId: 'txn-uuid', amount: '300', currency: 'MWK' }))
      .rejects.toMatchObject({ failureCode: 'MISSING_RECEIPT_NUMBER' });
  });

  it('503 → RailUnavailableError (retryable)', async () => {
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
    httpMock.post.mockRejectedValueOnce(makeAxiosError(503, 'Failed to process the request'));
    await expect(adapter.initiateRefund({ refundId: 'ref-1', depositId: 'txn-uuid', amount: '300', currency: 'MWK', receiptNumber: 'AGC20B5N44' }))
      .rejects.toBeInstanceOf(RailUnavailableError);
  });
});

describe('TnmAdapter — error mapping', () => {
  let adapter: TnmAdapter;
  let httpMock: ReturnType<typeof makeHttpMock>;

  beforeEach(() => {
    httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
    (adapter as unknown as { tokenCache: unknown }).tokenCache = { token: 'tok', expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    mockedAxiosAny.isAxiosError = jest.fn().mockReturnValue(true);
  });

  async function expectDeposit(status: number, message?: string) {
    httpMock.post.mockRejectedValueOnce(makeAxiosError(status, message));
    return adapter.initiateDeposit({ depositId: 'id', phoneNumber: '265881234567', amount: '100', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' });
  }

  it('HTTP 400 invalid data → RailRejectedError(INVALID_INPUT)', async () => {
    await expect(expectDeposit(400, 'The given data is invalid.')).rejects.toMatchObject({ name: 'RailRejectedError', failureCode: 'INVALID_INPUT' });
  });
  it('HTTP 400 invalid phone → RailRejectedError(INVALID_PHONE)', async () => {
    await expect(expectDeposit(400, 'Provide a valid TNM number')).rejects.toMatchObject({ name: 'RailRejectedError', failureCode: 'INVALID_PHONE' });
  });
  it('HTTP 401 → RailAuthError', async () => {
    await expect(expectDeposit(401, 'Invalid credentials')).rejects.toBeInstanceOf(RailAuthError);
  });
  it('HTTP 403 → RailAuthError', async () => {
    await expect(expectDeposit(403, 'not allowed')).rejects.toBeInstanceOf(RailAuthError);
  });
  it('HTTP 404 subscriber → RailRejectedError(SUBSCRIBER_NOT_FOUND)', async () => {
    await expect(expectDeposit(404, 'Subscriber not found')).rejects.toMatchObject({ name: 'RailRejectedError', failureCode: 'SUBSCRIBER_NOT_FOUND' });
  });
  it('HTTP 404 resource → RailRejectedError(NOT_FOUND)', async () => {
    await expect(expectDeposit(404, 'Resource not found')).rejects.toMatchObject({ name: 'RailRejectedError', failureCode: 'NOT_FOUND' });
  });
  it('HTTP 503 → RailUnavailableError', async () => {
    await expect(expectDeposit(503, 'Failed to process')).rejects.toBeInstanceOf(RailUnavailableError);
  });
  it('HTTP 500 → RailUnavailableError', async () => {
    await expect(expectDeposit(500, 'Internal server error')).rejects.toBeInstanceOf(RailUnavailableError);
  });

  it('network timeout → RailTimeoutError', async () => {
    const err = makeAxiosError(0, undefined, 'ECONNABORTED');
    (err as unknown as { response: undefined }).response = undefined as undefined;
    httpMock.post.mockRejectedValueOnce(err);
    await expect(adapter.initiateDeposit({ depositId: 'id', phoneNumber: '265881234567', amount: '100', currency: 'MWK', providerCode: 'TNM', customerMessage: 'Pay' }))
      .rejects.toBeInstanceOf(RailTimeoutError);
  });
});

describe('TnmAdapter — MSISDN normalisation', () => {
  let adapter: TnmAdapter;

  beforeEach(() => {
    const httpMock = makeHttpMock();
    mockedAxios.create = jest.fn().mockReturnValue(httpMock);
    adapter = new TnmAdapter(mockConfig);
  });

  it.each([
    ['265881234567', '265881234567'],
    ['+265881234567', '265881234567'],
    ['0881234567', '2650881234567'],
    ['881234567', '265881234567'],
  ])('normalises %s → %s', (input, expected) => {
    expect((adapter as unknown as { normaliseMsisdn: (s: string) => string }).normaliseMsisdn(input)).toBe(expected);
  });
});
