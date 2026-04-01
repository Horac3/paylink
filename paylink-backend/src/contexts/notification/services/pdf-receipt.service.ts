import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit') as typeof import('pdfkit');

export interface ReceiptData {
  transactionId: string;
  merchantName: string;
  msisdnHint: string;
  amount: string;
  currency: string;
  date: Date;
  feeAmount: string;
  netAmount: string;
}

/**
 * @description Generates PDF payment receipts using pdfkit.
 */
@Injectable()
export class PdfReceiptService {
  private readonly logger = new Logger(PdfReceiptService.name);

  async generate(data: ReceiptData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#1a56db').text('PayLink', 50, 50);
      doc.fontSize(12).fillColor('#000').text('Payment Receipt', 50, 80);
      doc.moveTo(50, 100).lineTo(550, 100).stroke();

      // Body
      const y = 120;
      const rows: [string, string][] = [
        ['Transaction ID', data.transactionId],
        ['Merchant', data.merchantName],
        ['Phone', `****${data.msisdnHint}`],
        ['Amount', `${data.currency} ${data.amount}`],
        ['Fee', `${data.currency} ${data.feeAmount}`],
        ['Net to Merchant', `${data.currency} ${data.netAmount}`],
        ['Date', data.date.toISOString().split('T')[0]],
      ];

      rows.forEach(([label, value], i) => {
        doc
          .fontSize(10)
          .fillColor('#6b7280')
          .text(label, 50, y + i * 25);
        doc
          .fontSize(10)
          .fillColor('#000')
          .text(value, 250, y + i * 25);
      });

      doc
        .moveTo(50, y + rows.length * 25 + 10)
        .lineTo(550, y + rows.length * 25 + 10)
        .stroke();
      doc
        .fontSize(8)
        .fillColor('#6b7280')
        .text(
          'PayLink — Payment Orchestration for Malawi',
          50,
          y + rows.length * 25 + 20,
        );

      doc.end();
    });
  }
}
