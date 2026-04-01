import Decimal from 'decimal.js';
import { Money } from '../money.vo';
import { DomainError } from '../../errors/domain.error';

describe('Money VO', () => {
  describe('construction', () => {
    it('creates valid Money', () => {
      const m = Money.of('500.00', 'MWK');
      expect(m.toString()).toBe('500.00');
      expect(m.currency).toBe('MWK');
    });

    it('throws on negative amount', () => {
      expect(() => Money.of('-1', 'MWK')).toThrow(DomainError);
    });

    it('throws on unsupported currency', () => {
      expect(() => Money.of('100', 'XYZ')).toThrow(DomainError);
    });

    it('allows zero amount', () => {
      const m = Money.of('0', 'MWK');
      expect(m.toString()).toBe('0.00');
    });
  });

  describe('add', () => {
    it('adds two money values', () => {
      const a = Money.of('100.00', 'MWK');
      const b = Money.of('200.50', 'MWK');
      expect(a.add(b).toString()).toBe('300.50');
    });

    it('throws on currency mismatch', () => {
      const a = Money.of('100', 'MWK');
      const b = Money.of('100', 'USD');
      expect(() => a.add(b)).toThrow(DomainError);
    });
  });

  describe('subtract', () => {
    it('subtracts two money values', () => {
      const a = Money.of('300.00', 'MWK');
      const b = Money.of('100.00', 'MWK');
      expect(a.subtract(b).toString()).toBe('200.00');
    });

    it('throws when result would be negative', () => {
      const a = Money.of('100', 'MWK');
      const b = Money.of('200', 'MWK');
      expect(() => a.subtract(b)).toThrow(DomainError);
    });
  });

  describe('multiplyByRate', () => {
    it('calculates fee correctly for STARTER tier', () => {
      const gross = Money.of('500.00', 'MWK');
      const fee = gross.multiplyByRate(new Decimal('0.020'));
      expect(fee.toString()).toBe('10.00');
    });

    it('rounds to 2 decimal places', () => {
      const gross = Money.of('333.33', 'MWK');
      const fee = gross.multiplyByRate(new Decimal('0.020'));
      expect(fee.toString()).toBe('6.67');
    });
  });

  describe('equals', () => {
    it('returns true for same amount and currency', () => {
      const a = Money.of('100.00', 'MWK');
      const b = Money.of('100.00', 'MWK');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different amounts', () => {
      const a = Money.of('100.00', 'MWK');
      const b = Money.of('200.00', 'MWK');
      expect(a.equals(b)).toBe(false);
    });
  });
});
