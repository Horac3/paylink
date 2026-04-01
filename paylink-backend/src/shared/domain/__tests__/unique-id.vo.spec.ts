import { UniqueId } from '../unique-id.vo';
import { MerchantId } from '../merchant-id.vo';
import { PayerId } from '../payer-id.vo';

describe('UniqueId VO', () => {
  it('generates a unique ID', () => {
    const id = UniqueId.generate();
    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('two generated IDs are not equal', () => {
    const a = UniqueId.generate();
    const b = UniqueId.generate();
    expect(a.equals(b)).toBe(false);
  });

  it('accepts existing value', () => {
    const id = new UniqueId('test-uuid');
    expect(id.value).toBe('test-uuid');
  });
});

describe('MerchantId VO', () => {
  it('creates branded UUID', () => {
    const id = MerchantId.create();
    expect(id.value).toBeDefined();
  });
});

describe('PayerId VO', () => {
  it('creates branded UUID', () => {
    const id = PayerId.create();
    expect(id.value).toBeDefined();
  });
});
