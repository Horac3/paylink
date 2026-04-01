import { DomainError } from './domain.error';

/**
 * @description Resource not found — maps to HTTP 404
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}
