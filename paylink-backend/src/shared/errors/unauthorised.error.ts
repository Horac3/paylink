import { DomainError } from './domain.error';

/**
 * @description Unauthorised error — maps to HTTP 401
 */
export class UnauthorisedError extends DomainError {
  constructor(message = 'Unauthorised') {
    super(message);
    this.name = 'UnauthorisedError';
  }
}
