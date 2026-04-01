import { LoginHandler } from '../commands/login.handler';
import { LoginCommand } from '../commands/login.command';
import { IMerchantRepository } from '../../domain/ports/merchant-repository.interface';
import { Merchant } from '../../domain/merchant.aggregate';
import { MerchantId } from '@shared/domain/merchant-id.vo';
import { FeeTier } from '@shared/domain/fee-tier.vo';
import { UnauthorisedError } from '@shared/errors/unauthorised.error';
import { BcryptAdapter } from '../../infrastructure/bcrypt.adapter';
import { JwtAdapter } from '../../infrastructure/jwt.adapter';

describe('LoginHandler', () => {
  const mockRepo: jest.Mocked<IMerchantRepository> = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const mockBcrypt: jest.Mocked<BcryptAdapter> = {
    hash: jest.fn(),
    compare: jest.fn(),
  } as unknown as jest.Mocked<BcryptAdapter>;

  const mockJwt: jest.Mocked<JwtAdapter> = {
    signPair: jest.fn(),
    verifyAccess: jest.fn(),
    verifyRefresh: jest.fn(),
  } as unknown as jest.Mocked<JwtAdapter>;

  let handler: LoginHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new LoginHandler(mockRepo, mockBcrypt, mockJwt);
  });

  const merchant = Merchant.reconstitute({
    id: MerchantId.create('test-id'),
    email: 'merchant@example.com',
    businessName: 'Test Biz',
    passwordHash: '$2b$12$hash',
    feeTier: FeeTier.STARTER,
  });

  it('returns tokens on valid credentials', async () => {
    mockRepo.findByEmail.mockResolvedValue(merchant);
    mockBcrypt.compare.mockResolvedValue(true);
    mockJwt.signPair.mockReturnValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const result = await handler.execute(
      new LoginCommand('merchant@example.com', 'password'),
    );

    expect(result.accessToken).toBe('access');
    expect(result.merchantId).toBe('test-id');
  });

  it('throws UnauthorisedError for non-existent merchant', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(
      handler.execute(new LoginCommand('unknown@test.com', 'pass')),
    ).rejects.toThrow(UnauthorisedError);
  });

  it('throws UnauthorisedError for wrong password', async () => {
    mockRepo.findByEmail.mockResolvedValue(merchant);
    mockBcrypt.compare.mockResolvedValue(false);
    await expect(
      handler.execute(new LoginCommand('merchant@example.com', 'wrong')),
    ).rejects.toThrow(UnauthorisedError);
  });
});
