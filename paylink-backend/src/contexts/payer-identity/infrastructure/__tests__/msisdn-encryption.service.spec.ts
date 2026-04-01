import { MsisdnEncryptionService } from '../msisdn-encryption.service';
import { ConfigService } from '@nestjs/config';

const mockConfig = {
  getOrThrow: (key: string) => {
    if (key === 'ENCRYPTION_KEY') return 'a'.repeat(64); // 32 bytes as hex
    throw new Error(`Unknown key: ${key}`);
  },
  get: (key: string) => {
    if (key === 'ENCRYPTION_IV_LENGTH') return 16;
    return undefined;
  },
} as unknown as ConfigService;

describe('MsisdnEncryptionService', () => {
  let service: MsisdnEncryptionService;

  beforeEach(() => {
    service = new MsisdnEncryptionService(mockConfig);
  });

  it('encrypts and decrypts round-trip correctly', () => {
    const msisdn = '+265999000001';
    const encrypted = service.encrypt(msisdn);
    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(msisdn);
  });

  it('produces different ciphertexts for same input (random IV)', () => {
    const msisdn = '+265999000001';
    const enc1 = service.encrypt(msisdn);
    const enc2 = service.encrypt(msisdn);
    expect(enc1.data.iv).not.toBe(enc2.data.iv);
    expect(enc1.data.ciphertext).not.toBe(enc2.data.ciphertext);
  });

  it('serialises to storage string and back', () => {
    const msisdn = '+265888000002';
    const encrypted = service.encrypt(msisdn);
    const stored = encrypted.toStorageString();
    const restored = service.decrypt(
      require('../../domain/encrypted-msisdn.vo').EncryptedMsisdn.fromString(
        stored,
      ),
    );
    expect(restored).toBe(msisdn);
  });
});
