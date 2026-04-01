/**
 * @description Retry backoff policy for subscription payment failures.
 * attempt 1 → 24h, attempt 2 → 72h, attempt 3 → 7d, attempt 4 → null (cancel)
 */
export class RetryPolicy {
  private static readonly DELAYS_MS: Record<number, number | null> = {
    1: 24 * 60 * 60 * 1000,
    2: 72 * 60 * 60 * 1000,
    3: 7 * 24 * 60 * 60 * 1000,
    4: null,
  };

  /**
   * @description Returns delay in ms for the given retry attempt, or null to cancel.
   */
  static delayFor(attempt: number): number | null {
    return RetryPolicy.DELAYS_MS[attempt] ?? null;
  }

  static nextRetryAt(attempt: number): Date | null {
    const delay = RetryPolicy.delayFor(attempt);
    if (delay === null) return null;
    return new Date(Date.now() + delay);
  }
}
