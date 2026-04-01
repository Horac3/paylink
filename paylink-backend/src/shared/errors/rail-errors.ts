/**
 * @description Typed domain errors for payment rail failures.
 * All rail adapters throw these typed errors — never raw Axios errors.
 */

/**
 * @description Rail temporarily unavailable — retryable
 */
export class RailUnavailableError extends Error {
  readonly retryable = true;

  constructor(
    message: string,
    readonly railId: string,
  ) {
    super(message);
    this.name = 'RailUnavailableError';
  }
}

/**
 * @description Rail rejected the request — not retryable
 */
export class RailRejectedError extends Error {
  readonly retryable = false;

  constructor(
    readonly failureCode: string,
    message: string,
    readonly railId: string,
  ) {
    super(message);
    this.name = 'RailRejectedError';
  }
}

/**
 * @description Rail request timed out — retryable
 */
export class RailTimeoutError extends Error {
  readonly retryable = true;

  constructor(
    message: string,
    readonly railId: string,
  ) {
    super(message);
    this.name = 'RailTimeoutError';
  }
}

/**
 * @description Rail authentication/authorisation failed — not retryable, alert immediately
 */
export class RailAuthError extends Error {
  readonly retryable = false;

  constructor(
    message: string,
    readonly railId: string,
  ) {
    super(message);
    this.name = 'RailAuthError';
  }
}
