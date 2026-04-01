import {
  RailUnavailableError,
  RailRejectedError,
  RailTimeoutError,
  RailAuthError,
} from '../rail-errors';

describe('Rail Errors', () => {
  it('RailUnavailableError is retryable', () => {
    const err = new RailUnavailableError('Provider down', 'PAWAPAY');
    expect(err.retryable).toBe(true);
    expect(err.railId).toBe('PAWAPAY');
    expect(err.name).toBe('RailUnavailableError');
  });

  it('RailRejectedError is not retryable and carries failureCode', () => {
    const err = new RailRejectedError(
      'INVALID_PHONE',
      'Invalid phone',
      'PAWAPAY',
    );
    expect(err.retryable).toBe(false);
    expect(err.failureCode).toBe('INVALID_PHONE');
  });

  it('RailTimeoutError is retryable', () => {
    const err = new RailTimeoutError('Request timed out', 'PAWAPAY');
    expect(err.retryable).toBe(true);
  });

  it('RailAuthError is not retryable', () => {
    const err = new RailAuthError('Auth failed', 'PAWAPAY');
    expect(err.retryable).toBe(false);
    expect(err.name).toBe('RailAuthError');
  });
});
