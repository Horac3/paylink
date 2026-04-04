import { LinkType } from '../../domain/payment-link.aggregate';

export class CreateLinkCommand {
  constructor(
    readonly merchantId: string,
    readonly type: LinkType,
    readonly amount: string | null,
    readonly currency: string,
    readonly recurrenceInterval: 'WEEKLY' | 'MONTHLY' | null,
    readonly maxCycles: number | null,
    readonly expiresAt: Date | null,
    readonly metadata: Record<string, unknown> | null,
    readonly recipientMsisdn: string | null = null,
    readonly providerCode: string | null = null,
  ) {}
}
