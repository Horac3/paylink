import { PushProcessor } from '../processors/push.processor';
import { FirebaseMessagingService } from '../../../../infrastructure/firebase/firebase-messaging.service';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Job } from 'bullmq';

describe('PushProcessor', () => {
  const mockFcm = {
    sendToDevice: jest.fn(),
  } as unknown as jest.Mocked<FirebaseMessagingService>;
  const mockPrisma = {
    transaction: { findUnique: jest.fn() },
  } as unknown as jest.Mocked<PrismaService>;

  let processor: PushProcessor;
  beforeEach(() => {
    jest.clearAllMocks();
    processor = new PushProcessor(mockFcm, mockPrisma);
  });

  it('skips push when no FCM token', async () => {
    (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue({
      payerAccount: null,
    });
    await processor.process({
      name: 'send-push',
      data: { type: 'payment_settled', transactionId: 'txn-1' },
    } as unknown as Job);
    expect(mockFcm.sendToDevice).not.toHaveBeenCalled();
  });

  it('sends push when FCM token present', async () => {
    (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue({
      payerAccount: { fcmToken: 'device-token' },
    });
    mockFcm.sendToDevice.mockResolvedValue();
    await processor.process({
      name: 'send-push',
      data: { type: 'payment_settled', transactionId: 'txn-1' },
    } as unknown as Job);
    expect(mockFcm.sendToDevice).toHaveBeenCalledWith(
      'device-token',
      expect.objectContaining({ title: 'Payment Confirmed' }),
    );
  });
});
