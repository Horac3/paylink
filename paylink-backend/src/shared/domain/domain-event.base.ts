import { v4 as uuidv4 } from 'uuid';

/**
 * @description Abstract base class for all domain events.
 * All domain events extend this class.
 */
export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  abstract readonly eventType: string;

  constructor() {
    this.eventId = uuidv4();
    this.occurredAt = new Date();
  }
}
