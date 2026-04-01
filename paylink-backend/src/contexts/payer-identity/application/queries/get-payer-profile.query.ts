export class GetPayerProfileQuery {
  constructor(readonly payerId: string) {}
}

export interface PayerProfileReadModel {
  id: string;
  email: string;
  msisdnHint: string;
  preferredRail: string;
  preferredProvider: string;
  verified: boolean;
}
