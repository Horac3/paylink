/**
 * @description Base domain error — maps to HTTP 400 Bad Request
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
