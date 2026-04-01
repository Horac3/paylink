import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  it('instantiates without error', () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    const service = new PrismaService();
    expect(service).toBeDefined();
  });
});
