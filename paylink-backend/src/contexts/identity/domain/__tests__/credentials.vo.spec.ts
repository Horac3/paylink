import { Credentials } from '../credentials.vo';

describe('Credentials VO', () => {
  it('stores hash and exposes it', () => {
    const creds = Credentials.fromHash('$2b$12$somehash');
    expect(creds.hash).toBe('$2b$12$somehash');
  });

  it('creates from hash string', () => {
    const creds = Credentials.fromHash('hash123');
    expect(creds).toBeInstanceOf(Credentials);
  });
});
