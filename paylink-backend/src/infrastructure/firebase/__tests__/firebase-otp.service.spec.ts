import { FirebaseOtpService } from '../firebase-otp.service';
import * as admin from 'firebase-admin';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('firebase-admin', () => ({
  auth: jest.fn(),
  apps: [],
}));

describe('FirebaseOtpService', () => {
  let service: FirebaseOtpService;

  beforeEach(() => {
    service = new FirebaseOtpService();
  });

  it('returns phone number from valid token', async () => {
    const mockVerify = jest
      .fn()
      .mockResolvedValue({ phone_number: '+265999000001' });
    (admin.auth as jest.Mock).mockReturnValue({ verifyIdToken: mockVerify });

    const phone = await service.verifyIdToken('valid-token');
    expect(phone).toBe('+265999000001');
  });

  it('throws UnauthorizedException for invalid token', async () => {
    const mockVerify = jest.fn().mockRejectedValue(new Error('Token expired'));
    (admin.auth as jest.Mock).mockReturnValue({ verifyIdToken: mockVerify });

    await expect(service.verifyIdToken('bad-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when token has no phone', async () => {
    const mockVerify = jest.fn().mockResolvedValue({ uid: 'user123' });
    (admin.auth as jest.Mock).mockReturnValue({ verifyIdToken: mockVerify });

    await expect(service.verifyIdToken('no-phone-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
