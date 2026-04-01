import { PdfReceiptService } from '../pdf-receipt.service';

describe('PdfReceiptService', () => {
  it('generates a PDF buffer', async () => {
    const service = new PdfReceiptService();
    const buffer = await service.generate({
      transactionId: 'txn-123',
      merchantName: 'Test Merchant',
      msisdnHint: '0001',
      amount: '500.00',
      currency: 'MWK',
      date: new Date('2024-01-01'),
      feeAmount: '10.00',
      netAmount: '490.00',
    });
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
