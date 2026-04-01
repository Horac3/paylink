import { DomainError } from './domain.error';

/**
 * @description Conflict error — maps to HTTP 409 (e.g. duplicate email)
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
