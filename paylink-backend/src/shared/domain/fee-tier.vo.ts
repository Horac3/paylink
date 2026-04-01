import Decimal from 'decimal.js';

/**
 * @description Fee tier enum with associated rates.
 * STARTER = 2%, GROWTH = 1.5%, ENTERPRISE = 1%
 */
export enum FeeTier {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}

const FEE_RATES: Record<FeeTier, string> = {
  [FeeTier.STARTER]: '0.020',
  [FeeTier.GROWTH]: '0.015',
  [FeeTier.ENTERPRISE]: '0.010',
};

export class FeeTierHelper {
  /**
   * @description Returns the fee rate for a given tier as a Decimal
   * @param tier The merchant fee tier
   * @returns Decimal rate e.g. Decimal('0.020') for STARTER
   */
  static rateFor(tier: FeeTier): Decimal {
    return new Decimal(FEE_RATES[tier]);
  }
}
