import { VerifyOtpHandler } from '../commands/verify-otp.handler';
import { VerifyOtpCommand } from '../commands/verify-otp.command';
import { IPayerRepository } from '../../domain/ports/payer-repository.interface';
import { PayerAccount } from '../../domain/payer-account.aggregate';
import { PayerId } from '@shared/domain/payer-id.vo';
import { EncryptedMsisdn } from '../../domain/encrypted-msisdn.vo';
import { FirebaseOtpService } from '../../../../infrastructure/firebase/firebase-otp.service';
import { MsisdnEncryptionService } from '../../infrastructure/msisdn-encryption.service';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';
import { NotFoundError } from '@shared/errors/not-found.error';
import { EventBus } from '@nestjs/cqrs';

const makePayer = (msisdnHint = '0001') =>
  PayerAccount.reconstitute({
    id: PayerId.create('payer-id'),
    email: 'payer@test.com',
    msisdnEncrypted: EncryptedMsisdn.fromData({
      ciphertext: 'c',
      iv: 'i',
      authTag: 'a',
    }),
    msisdnHash: 'hash',
    msisdnHint,
    preferredRail: 'PAWAPAY',
    preferredProvider: 'AIRTEL_MALAWI',
    verified: false,
    fcmToken: null,
  });

describe('VerifyOtpHandler', () => {
  const mockRepo = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByMsisdnHash: jest.fn(),
    save: jest.fn(),
  } as jest.Mocked<IPayerRepository>;
  const mockFirebase = {
    verifyIdToken: jest.fn(),
  } as unknown as jest.Mocked<FirebaseOtpService>;
  const mockEncryption = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  } as unknown as jest.Mocked<MsisdnEncryptionService>;
  const mockEventBus = { publish: jest.fn() } as unknown as EventBus;

  let handler: VerifyOtpHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new VerifyOtpHandler(
      mockRepo,
      mockFirebase,
      mockEncryption,
      mockEventBus,
    );
  });

  it('verifies payer when phone matches', async () => {
    mockRepo.findById.mockResolvedValue(makePayer());
    mockFirebase.verifyIdToken.mockResolvedValue('+265999000001');
    mockEncryption.decrypt.mockReturnValue('+265999000001');
    mockRepo.save.mockResolvedValue();

    const result = await handler.execute(
      new VerifyOtpCommand('payer-id', 'valid-token'),
    );
    expect(result.verified).toBe(true);
  });

  it('throws NotFoundError when payer not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new VerifyOtpCommand('unknown', 'token')),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws UnauthorisedError when phone does not match', async () => {
    mockRepo.findById.mockResolvedValue(makePayer());
    mockFirebase.verifyIdToken.mockResolvedValue('+265888000000');
    mockEncryption.decrypt.mockReturnValue('+265999000001');
    await expect(
      handler.execute(new VerifyOtpCommand('payer-id', 'bad-token')),
    ).rejects.toThrow(UnauthorisedError);
  });
});
